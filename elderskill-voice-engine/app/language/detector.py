import fasttext
import numpy as np
from typing import Optional, Dict, Any, Tuple
from dataclasses import dataclass
import logging
import os

logger = logging.getLogger(__name__)

@dataclass
class LanguageResult:
    language: str
    language_confidence: float
    segments: list
    all_scores: Dict[str, float]

class LanguageDetector:
    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path or "./models/lid.176.bin"
        
        # Download model if not exists
        if not os.path.exists(self.model_path):
            self._download_model()
        
        try:
            self.model = fasttext.load_model(self.model_path)
            logger.info("FastText language detection model loaded")
        except Exception as e:
            logger.error(f"Failed to load FastText model: {e}")
            self.model = None
        
        # Language code mapping
        self.language_map = {
            'ta': 'Tamil',
            'hi': 'Hindi',
            'en': 'English',
            'te': 'Telugu',
            'ml': 'Malayalam',
            'kn': 'Kannada',
            'bn': 'Bengali',
            'mr': 'Marathi',
            'gu': 'Gujarati',
            'pa': 'Punjabi',
            'or': 'Odia'
        }
    
    def _download_model(self):
        """Download FastText language identification model"""
        import urllib.request
        url = "https://dl.fbaipublicfiles.com/fasttext/supervised-models/lid.176.bin"
        logger.info(f"Downloading FastText model from {url}")
        urllib.request.urlretrieve(url, self.model_path)
    
    def detect(self, text: str) -> LanguageResult:
        """Detect language from text"""
        if self.model is None:
            return LanguageResult(
                language='en',
                language_confidence=0.5,
                segments=[],
                all_scores={'en': 0.5}
            )
        
        # Clean text
        text = text.replace('\n', ' ').strip()
        
        if not text:
            return LanguageResult(
                language='en',
                language_confidence=0.0,
                segments=[],
                all_scores={}
            )
        
        # Predict
        predictions = self.model.predict(text, k=5)
        
        # Parse predictions
        all_scores = {}
        for label, prob in zip(predictions[0], predictions[1]):
            lang_code = label.replace('__label__', '')
            all_scores[lang_code] = float(prob)
        
        # Get top language
        top_lang = predictions[0][0].replace('__label__', '')
        top_prob = float(predictions[1][0])
        
        # Detect code-switching segments
        segments = self._detect_segments(text)
        
        return LanguageResult(
            language=top_lang,
            language_confidence=top_prob,
            segments=segments,
            all_scores=all_scores
        )
    
    def _detect_segments(self, text: str) -> list:
        """Detect language segments for code-switching"""
        segments = []
        
        # Split into sentences
        import re
        sentences = re.split(r'[.!?]+', text)
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            
            predictions = self.model.predict(sentence, k=1)
            lang_code = predictions[0][0].replace('__label__', '')
            prob = float(predictions[1][0])
            
            segments.append({
                'text': sentence,
                'language': lang_code,
                'confidence': prob
            })
        
        return segments
    
    def detect_from_audio(self, audio: np.ndarray, asr_language: Optional[str] = None) -> LanguageResult:
        """Detect language from audio using ASR language hint"""
        if asr_language and asr_language in self.language_map:
            return LanguageResult(
                language=asr_language,
                language_confidence=0.9,
                segments=[],
                all_scores={asr_language: 0.9}
            )
        
        return LanguageResult(
            language='en',
            language_confidence=0.5,
            segments=[],
            all_scores={'en': 0.5}
        )
