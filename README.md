# SilverHands Platform

## First-time setup

./scripts/setup.sh

## Start everything

./scripts/startup.sh

## Stop everything

./scripts/stop.sh

## Services

SilverHands App:
http://localhost:<actual-port>

Pages:
http://localhost:<actual-port>

ElderSkill Voice API:
http://localhost:8000

## Prerequisites
- Node.js (v18+)
- npm
- Python 3.10+
- Git

## Environment Variables
- `silverhands-app/.env`: Requires Supabase and Gemini keys.
- `pages/.env`: Requires Supabase keys.
- `elderskill-voice-engine/.env`: Requires Sarvam AI key (ASR/TTS) and optional LLM keys.

## Model Requirements
The ElderSkill Voice Engine requires local model files:
- Whisper Model
- FastText Model (lid.176.bin)

Place them in `elderskill-voice-engine/models/` as specified in `.env`.

## Logging
Logs and PIDs are automatically stored in the `logs/` and `.run/` directories respectively at the root of the project.

## Common Issues
- **Ports**: If a port is occupied, the script will gracefully handle it or notify you.
- **Missing Models**: The setup script will warn you if model directories are empty.
