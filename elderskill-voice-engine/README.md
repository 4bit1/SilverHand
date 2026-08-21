# ElderSkill Voice Intelligence Engine

This folder is organized from the supplied production-implementation document.

## Pipeline

User voice → audio quality analysis → VAD → high-precision ASR → language detection →
transcript validation → profile extraction → critical-fact normalization →
provenance-aware profile update → missing-information analysis → next-question generation →
TTS → user response.

## Important source note

The supplied document calls this a complete production implementation, but it does not
contain implementations for every file named in its architecture tree. Files with no
implementation section are therefore included as explicit placeholders rather than
invented code.

The extracted source also contains a few integration inconsistencies that should be
resolved before deployment (for example, imports referring to modules not present in
the architecture's implementation sections). See `SOURCE_NOTES.md`.

## Configuration

Copy `.env.example` to `.env` and provide the required model/API credentials.

## Docker

The source document provides CPU and GPU Dockerfiles plus a compose definition under
`docker/`.

## Tests

The architecture includes unit/integration test locations under `tests/`; some are
placeholders because their implementations were not supplied in the source document.
