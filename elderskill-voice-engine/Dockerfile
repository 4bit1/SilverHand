# Create Dockerfile
cat > Dockerfile << 'DOCKEREOF'
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    build-essential \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p app/templates app/static app/utils app/asr models data temp

# Expose port
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    AUDIO_SAMPLE_RATE=16000 \
    MAX_RECORDING_SECONDS=120

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
DOCKEREOF

# Create requirements.txt
cat > requirements.txt << 'REQEOF'
fastapi==0.115.0
uvicorn[standard]==0.30.6
pydantic==2.9.2
pydantic-settings==2.5.2
python-multipart==0.0.9
numpy==2.0.2
scipy==1.14.1
librosa==0.10.2.post1
soundfile==0.12.1
torch==2.4.1
torchaudio==2.4.1
openai-whisper==20240930
httpx==0.27.2
aiohttp==3.10.5
python-dotenv==1.0.1
tenacity==8.5.0
REQEOF

# Create docker-compose.yml
cat > docker-compose.yml << 'COMPOSEEOF'
version: '3.8'

services:
  elderskill:
    build: .
    container_name: elderskill-voice-engine
    ports:
      - "8000:8000"
    environment:
      - SARVAM_API_KEY=${SARVAM_API_KEY:-}
      - LLM_API_KEY=${LLM_API_KEY:-}
      - DATABASE_URL=sqlite:///./data/elderskill.db
      - LOG_LEVEL=INFO
      - AUDIO_SAMPLE_RATE=16000
      - MAX_RECORDING_SECONDS=120
    volumes:
      - ./data:/app/data
      - ./models:/app/models
      - ./temp:/app/temp
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Optional: Redis for session management (future scaling)
  redis:
    image: redis:7-alpine
    container_name: elderskill-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  redis_data:
COMPOSEEOF

# Create .dockerignore
cat > .dockerignore << 'DOCKERIGNOREEOF'
__pycache__
*.pyc
*.pyo
*.pyd
.Python
*.so
*.egg
*.egg-info
dist
build
.env
.venv
venv
venv311
venv310
*.db
*.sqlite
.git
.gitignore
README.md
models/*
!models/.gitkeep
data/*
!data/.gitkeep
temp/*
!temp/.gitkeep
*.wav
*.webm
*.mp4
*.mp3
.pytest_cache
.mypy_cache
DOCKERIGNOREEOF

# Create .env.example
cat > .env.example << 'ENVEOF'
# Sarvam AI API Key (Primary ASR)
SARVAM_API_KEY=your-sarvam-api-key-here

# LLM API Key (Optional - for future enhancements)
LLM_API_KEY=your-llm-api-key-here

# Database
DATABASE_URL=sqlite:///./data/elderskill.db

# Audio Configuration
AUDIO_SAMPLE_RATE=16000
MAX_RECORDING_SECONDS=120
MIN_RECORDING_SECONDS=0.5

# Logging
LOG_LEVEL=INFO

# Language
DEFAULT_LANGUAGE=en-IN
ENVEOF

# Create data directories
mkdir -p data models temp
touch data/.gitkeep models/.gitkeep temp/.gitkeep

# Build and run commands
echo ""
echo "========================================="
echo "ElderSkill Docker Setup Complete!"
echo "========================================="
echo ""
echo "To build and run:"
echo "  docker-compose up --build"
echo ""
echo "Or build separately:"
echo "  docker build -t elderskill ."
echo "  docker run -p 8000:8000 --env-file .env elderskill"
echo ""
echo "Access at: http://localhost:8000"
echo "Health check: http://localhost:8000/health"
echo "========================================="