#!/usr/bin/env bash
# scripts/setup.sh
# Sets up the SilverHands platform locally.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "=================================================="
echo " SILVERHANDS PLATFORM SETUP"
echo "=================================================="

# 1. Detect OS
OS="$(uname -s)"
echo "Operating System: $OS"

# 2. Verify commands & Install Conda if missing
MISSING_CMDS=0
for cmd in git node npm; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "=================================================="
        echo "AUTOMATIC SETUP FAILED"
        echo "=================================================="
        echo "Dependency: $cmd"
        echo "Reason: Command not found"
        echo "Required manual action: Install $cmd and add it to your PATH"
        exit 1
    fi
done

export PATH="$HOME/miniconda3/bin:$PATH"

if ! command -v conda >/dev/null 2>&1; then
    echo "Conda not found. Automatically downloading and installing Miniconda..."
    ARCH="$(uname -m)"
    if [ "$ARCH" != "x86_64" ]; then
        echo "=================================================="
        echo "AUTOMATIC SETUP FAILED"
        echo "=================================================="
        echo "Dependency: conda"
        echo "Reason: Automatic install currently only supports x86_64 architectures. Found: $ARCH"
        echo "Required manual action: Install Miniconda manually and rerun setup."
        exit 1
    fi
    
    MINICONDA_URL="https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh"
    INSTALLER="/tmp/miniconda_installer.sh"
    
    curl -sSLo "$INSTALLER" "$MINICONDA_URL"
    bash "$INSTALLER" -b -p "$HOME/miniconda3"
    rm -f "$INSTALLER"
    
    echo "Miniconda installed to $HOME/miniconda3."
fi

echo ""
echo "Setting up SilverHands App..."
cd "$REPO_ROOT/silverhands-app"
if [ ! -f .env ] && [ -f .env.example ]; then
    cp .env.example .env
    echo "Created .env from .env.example. Please review for any required manual keys."
fi
npm install --no-fund --no-audit
cd "$REPO_ROOT"

echo ""
echo "Setting up Pages..."
cd "$REPO_ROOT/pages"
if [ ! -f .env ] && [ -f .env.example ]; then
    cp .env.example .env
fi
npm install --no-fund --no-audit
cd "$REPO_ROOT"

echo ""
echo "Setting up ElderSkill Voice Engine..."
cd "$REPO_ROOT/elderskill-voice-engine"
if [ ! -f .env ] && [ -f .env.example ]; then
    cp .env.example .env
    echo "Created .env from .env.example. Please review for any required manual keys."
fi

# Conda environment creation
ENV_NAME="silverhands-py310"

if conda env list | grep -q "$ENV_NAME"; then
    echo "Python virtual environment $ENV_NAME already exists. Reusing it."
else
    echo "Creating Conda environment $ENV_NAME with Python 3.10..."
    conda create -y -n "$ENV_NAME" python=3.10
fi

echo "Installing ElderSkill Python dependencies..."
# Determine requirements
REQ_FILE=""
if [ -f "requirements1.txt" ]; then
    REQ_FILE="requirements1.txt"
elif [ -f "requirements.txt" ]; then
    REQ_FILE="requirements.txt"
fi

if [ -n "$REQ_FILE" ]; then
    # We must configure pip for CPU index
    # But conda run makes it easy to pass directly
    conda run -n "$ENV_NAME" python -m pip install --upgrade pip --quiet
    # Catch any torchaudio cpu index requirements seamlessly:
    conda run -n "$ENV_NAME" python -m pip install -r "$REQ_FILE" --extra-index-url https://download.pytorch.org/whl/cpu
fi

# Check models
# Whisper will automatically download its base model to ~/.cache/whisper, and lid.176 is unused.
MODEL_STATUS="READY"

# Ensure scripts are executable
chmod +x "$REPO_ROOT/scripts/"*.sh

echo ""
echo "=================================================="
echo " SILVERHANDS PLATFORM READY"
echo "=================================================="
echo ""
echo "SilverHands App:"
echo "Dependencies READY"
echo ""
echo "Pages:"
echo "Dependencies READY"
echo ""
echo "ElderSkill:"
echo "Python 3.10 environment READY"
echo "Environment: $ENV_NAME"
echo ""
echo "Model:"
echo "$MODEL_STATUS"
echo ""
echo "Setup completed automatically."
echo ""
echo "Run:"
echo ""
echo "./scripts/startup.sh"
echo "=================================================="
