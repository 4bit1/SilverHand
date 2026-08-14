
// ElderSkill Voice Interview Engine
class InterviewEngine {
    constructor() {
        this.sessionId = null;
        this.currentQuestion = null;
        this.currentQuestionId = null;
        this.questionNumber = 0;
        this.totalQuestions = 10;
        this.progress = 0;
        this.recordingState = 'IDLE'; // IDLE, QUESTION_PLAYING, READY_TO_RECORD, RECORDING, STOPPING, UPLOADING, TRANSCRIBING, ANALYZING, ANSWER_READY, QUESTION_GENERATING, COMPLETED, ERROR
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.audioStream = null;
        this.recordingStartTime = null;
        this.recordingTimer = null;
        this.transcript = [];
        this.answers = [];
        this.profileUpdates = [];
        this.language = 'en-IN';
        this.audioBlob = null;
        this.textAnswer = '';
        
        this.init();
    }
    
    async init() {
        this.bindEvents();
        this.checkSpeechSupport();
        await this.startInterview();
    }
    
    bindEvents() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.recordingState === 'RECORDING') {
                this.stopRecording();
            }
        });
    }
    
    checkSpeechSupport() {
        const messageEl = document.getElementById('voiceMessage');
        
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            messageEl.textContent = "This browser doesn't offer speech input. You can type your answer instead.";
            this.enableTextInput();
            return false;
        }
        
        if (!window.MediaRecorder) {
            messageEl.textContent = "This browser doesn't offer speech input. You can type your answer instead.";
            this.enableTextInput();
            return false;
        }
        
        messageEl.textContent = 'Tap to speak';
        return true;
    }
    
    async startInterview() {
        try {
            const response = await fetch('/api/interviews/start', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    user_id: 'user-' + Date.now(),
                    language: this.language
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.sessionId = result.data.session_id;
                this.currentQuestion = result.data.question;
                this.currentQuestionId = result.data.question_id;
                this.questionNumber = 1;
                this.progress = 0;
                
                this.displayQuestion();
                this.speakQuestion();
                this.updateState('QUESTION_PLAYING');
            } else {
                this.showError(result.error.message);
            }
            
        } catch (error) {
            this.showError('Failed to start interview. Please try again.');
            console.error('Start interview error:', error);
        }
    }
    
    displayQuestion() {
        document.getElementById('questionText').textContent = this.currentQuestion;
        document.getElementById('statusLabel').textContent = 'Ready';
        this.updateProgress();
    }
    
    speakQuestion() {
        if ('speechSynthesis' in window && this.currentQuestion) {
            const utterance = new SpeechSynthesisUtterance(this.currentQuestion);
            utterance.lang = this.language;
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            
            utterance.onend = () => {
                this.updateState('READY_TO_RECORD');
                document.getElementById('micBtn').disabled = false;
                document.getElementById('micLabel').textContent = 'Tap to speak';
            };
            
            window.speechSynthesis.speak(utterance);
        } else {
            this.updateState('READY_TO_RECORD');
        }
    }
    
    replayQuestion() {
        if (this.currentQuestion) {
            window.speechSynthesis.cancel();
            this.speakQuestion();
        }
    }
    
    async toggleRecording() {
        if (this.recordingState === 'RECORDING') {
            await this.stopRecording();
        } else if (this.recordingState === 'READY_TO_RECORD') {
            await this.startRecording();
        }
    }
    
    async startRecording() {
        try {
            // Request microphone access
            this.audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });
            
            const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
                ? 'audio/webm' 
                : 'audio/mp4';
            
            this.mediaRecorder = new MediaRecorder(this.audioStream, {
                mimeType: mimeType
            });
            
            this.audioChunks = [];
            this.recordingStartTime = Date.now();
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = async () => {
                await this.processRecording();
            };
            
            this.mediaRecorder.start(1000);
            
            this.updateState('RECORDING');
            document.getElementById('micBtn').classList.add('recording');
            document.getElementById('micLabel').textContent = 'Listening...';
            document.getElementById('recordingStatus').style.display = 'block';
            
            this.recordingTimer = setInterval(() => {
                const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                document.getElementById('recordingDuration').textContent = 
                    `${minutes}:${seconds.toString().padStart(2, '0')}`;
                
                // Auto-stop after 120 seconds
                if (elapsed >= 120) {
                    this.stopRecording();
                }
            }, 1000);
            
        } catch (error) {
            console.error('Microphone error:', error);
            document.getElementById('voiceMessage').textContent = 
                'Microphone access is unavailable. You can continue by typing your answer.';
            this.enableTextInput();
        }
    }
    
    async stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.updateState('STOPPING_RECORDING');
            this.mediaRecorder.stop();
        }
        
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
        }
        
        clearInterval(this.recordingTimer);
    }
    
    async processRecording() {
        this.updateState('UPLOADING');
        
        const audioBlob = new Blob(this.audioChunks, {type: 'audio/webm'});
        this.audioBlob = audioBlob;
        
        if (audioBlob.size < 1000) {
            this.showError("We couldn't hear a clear response. Please try again.");
            this.updateState('READY_TO_RECORD');
            return;
        }
        
        await this.uploadAnswer(audioBlob);
    }
    
    async uploadAnswer(audioBlob) {
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');
            formData.append('question_id', this.currentQuestionId);
            formData.append('session_id', this.sessionId);
            formData.append('input_type', 'voice');
            formData.append('language', this.language);
            
            const response = await fetch(`/api/interviews/${this.sessionId}/answer`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                await this.handleAnswerResult(result.data);
            } else {
                this.showError(result.error.message);
                this.updateState('READY_TO_RECORD');
            }
            
        } catch (error) {
            console.error('Upload error:', error);
            this.showError('We couldn\'t save your response. Please try again.');
            this.updateState('READY_TO_RECORD');
        }
    }
    
    async submitAnswer() {
        const textAnswer = document.getElementById('answerTextarea').value.trim();
        
        if (!textAnswer) {
            this.showError('Please provide an answer or record your voice.');
            return;
        }
        
        this.updateState('ANALYZING');
        document.getElementById('continueBtn').disabled = true;
        
        try {
            const response = await fetch(`/api/interviews/${this.sessionId}/answer`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    question_id: this.currentQuestionId,
                    session_id: this.sessionId,
                    input_type: 'text',
                    text_answer: textAnswer,
                    language: this.language
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                await this.handleAnswerResult(result.data);
            } else {
                this.showError(result.error.message);
            }
            
        } catch (error) {
            this.showError('Failed to submit answer. Please try again.');
        }
    }
    
    async handleAnswerResult(data) {
        this.updateState('ANALYZING');
        
        // Display transcript
        const transcript = data.transcript || '';
        this.addTranscript(this.currentQuestion, transcript);
        
        // Store answer
        this.answers.push({
            question: this.currentQuestion,
            answer: transcript,
            answer_id: data.answer_id
        });
        
        // Update profile
        if (data.profile_updates && data.profile_updates.length > 0) {
            this.profileUpdates.push(...data.profile_updates);
        }
        
        // Update progress
        this.progress = data.progress || this.progress;
        this.updateProgress();
        
        // Show success state
        document.getElementById('micBtn').classList.add('success');
        document.getElementById('micLabel').textContent = 'Answer captured';
        document.getElementById('statusLabel').textContent = 'Processing...';
        
        // Get next question
        setTimeout(async () => {
            await this.loadNextQuestion(data.next_question);
        }, 1500);
    }
    
    async loadNextQuestion(nextQuestionData) {
        this.updateState('QUESTION_GENERATING');
        
        try {
            if (nextQuestionData && nextQuestionData.text) {
                this.currentQuestion = nextQuestionData.text;
                this.currentQuestionId = nextQuestionData.id;
                this.questionNumber++;
            } else {
                // Fetch next question from server
                const response = await fetch(`/api/interviews/${this.sessionId}/next-question`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'}
                });
                
                const result = await response.json();
                
                if (result.success) {
                    this.currentQuestion = result.data.question;
                    this.currentQuestionId = result.data.question_id;
                    this.questionNumber++;
                } else {
                    throw new Error('Failed to get next question');
                }
            }
            
            // Reset UI
            document.getElementById('micBtn').classList.remove('recording', 'success', 'processing');
            document.getElementById('micBtn').disabled = false;
            document.getElementById('micLabel').textContent = 'Tap to speak';
            document.getElementById('recordingStatus').style.display = 'none';
            document.getElementById('answerTextarea').value = '';
            document.getElementById('continueBtn').disabled = false;
            
            this.displayQuestion();
            this.speakQuestion();
            
        } catch (error) {
            console.error('Next question error:', error);
            
            // Check if interview is complete
            if (this.progress >= 1.0) {
                this.completeInterview();
            } else {
                this.showError('Failed to generate next question. Please try again.');
            }
        }
    }
    
    completeInterview() {
        this.updateState('COMPLETED');
        document.getElementById('statusLabel').textContent = 'Complete';
        document.getElementById('questionText').textContent = 
            'Your conversation is complete. Thank you for sharing your experience.';
        document.getElementById('micBtn').style.display = 'none';
        document.getElementById('micLabel').style.display = 'none';
        document.getElementById('answerTextarea').disabled = true;
        document.getElementById('continueBtn').disabled = true;
    }
    
    enableTextInput() {
        document.getElementById('answerTextarea').disabled = false;
        document.getElementById('answerTextarea').focus();
        document.getElementById('continueBtn').disabled = false;
        document.getElementById('micBtn').disabled = true;
    }
    
    addTranscript(question, answer) {
        const transcriptList = document.getElementById('transcriptList');
        const item = document.createElement('div');
        item.className = 'transcript-item';
        item.innerHTML = `
            <div class="transcript-question">${question}</div>
            <div class="transcript-answer">${answer || '(No response)'}</div>
        `;
        transcriptList.appendChild(item);
    }
    
    updateProgress() {
        const percentage = Math.round(this.progress * 100);
        document.getElementById('progressPercentage').textContent = `${percentage}% complete`;
        document.getElementById('progressFill').style.width = `${percentage}%`;
    }
    
    updateState(state) {
        this.recordingState = state;
        console.log('State:', state);
        
        const micBtn = document.getElementById('micBtn');
        
        switch(state) {
            case 'RECORDING':
                micBtn.classList.add('recording');
                break;
            case 'PROCESSING':
            case 'UPLOADING':
            case 'TRANSCRIBING':
            case 'ANALYZING':
                micBtn.classList.add('processing');
                break;
            case 'READY_TO_RECORD':
                micBtn.classList.remove('recording', 'processing', 'success');
                break;
            case 'ANSWER_READY':
                micBtn.classList.add('success');
                break;
        }
    }
    
    showError(message) {
        document.getElementById('statusLabel').textContent = 'Error';
        document.getElementById('statusLabel').style.color = 'var(--error)';
        document.getElementById('voiceMessage').textContent = message;
        document.getElementById('voiceMessage').style.color = 'var(--error)';
        
        setTimeout(() => {
            document.getElementById('statusLabel').textContent = 'Ready';
            document.getElementById('statusLabel').style.color = '';
            document.getElementById('voiceMessage').textContent = 'Tap to speak';
            document.getElementById('voiceMessage').style.color = '';
        }, 3000);
    }
    
    goBack() {
        // Preserve current state, just go back in history
        history.back();
    }
    
    confirmExit() {
        if (confirm('Your answers so far have been saved. Do you want to leave the interview?')) {
            window.location.href = '/';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.interview = new InterviewEngine();
});
