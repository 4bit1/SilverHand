# Source Notes

This package is an organized extraction of the supplied markdown, not a claim that every
module is fully implemented.

## Implementation supplied by the source

The source contains code sections for:
- `app/config.py`
- `app/models/profile.py`
- `app/models/session.py`
- `app/audio/quality_analyzer.py`
- `app/audio/vad.py`
- `app/asr/whisper_asr.py`
- `app/asr/manager.py`
- `app/language/detector.py`
- `app/nlp/profile_extractor.py`
- `app/nlp/critical_fact_normalizer.py`
- `app/orchestration/conversation_orchestrator.py`
- `app/main.py`
- `app/api/routes/voice.py`
- `app/api/routes/interview.py`
- `docker/Dockerfile`
- `docker/Dockerfile.gpu`
- `docker/docker-compose.yml`
- `requirements.txt`
- `requirements-gpu.txt`
- `app/evaluation/metrics.py`

Other files are architecture-listed placeholders because their source implementation
was not present in the supplied document.

## Known integration checks before running

1. Verify all imports resolve, especially TTS/storage/orchestration/API modules.
2. Run a Python syntax check across `app/` and `tests/`.
3. Review dependency versions against the target Python/CUDA environment.
4. Configure CORS, authentication, secrets, and production database settings.
5. Do not treat the source's production-readiness checklist as a verified deployment
   result; it is a checklist contained in the supplied document.
