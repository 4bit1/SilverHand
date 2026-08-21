#!/usr/bin/env bash
# scripts/startup.sh
# Starts the complete SilverHands platform locally.

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOGS_DIR="$REPO_ROOT/logs"
RUN_DIR="$REPO_ROOT/.run"

mkdir -p "$LOGS_DIR"
mkdir -p "$RUN_DIR"

# Cleanup function for CTRL+C / SIGTERM
cleanup() {
    echo ""
    echo "Stopping SilverHands Platform..."
    "$REPO_ROOT/scripts/stop.sh"
    echo "✓ all started services stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "=================================================="
echo " STARTING SILVERHANDS PLATFORM"
echo "=================================================="

wait_for_port() {
    local name=$1
    local port=$2
    local timeout=30
    local count=0
    while ! curl -s -f "http://localhost:$port" >/dev/null; do
        if [ "$count" -ge "$timeout" ]; then
            echo "      ✗ $name failed to start on port $port (timeout)"
            return 1
        fi
        sleep 1
        count=$((count+1))
    done
    return 0
}

wait_for_health() {
    local name=$1
    local url=$2
    local timeout=30
    local count=0
    while ! curl -s -f "$url" >/dev/null; do
        if [ "$count" -ge "$timeout" ]; then
            echo "      ✗ $name failed to start (timeout)"
            return 1
        fi
        sleep 1
        count=$((count+1))
    done
    return 0
}

is_running() {
    local pidfile=$1
    if [ -f "$pidfile" ]; then
        local pid=$(cat "$pidfile")
        if kill -0 "$pid" 2>/dev/null; then
            return 0
        fi
    fi
    return 1
}

# 1. ElderSkill Voice Engine
echo "[1/3] Starting ElderSkill Voice Engine..."

ES_PORT=8000
ES_LOG="$LOGS_DIR/elderskill-voice-engine.log"
ES_PID="$RUN_DIR/elderskill-voice-engine.pid"
export PATH="$HOME/miniconda3/bin:$PATH"
ES_CMD="conda run -n silverhands-py310 python -m uvicorn app.main:app --host 0.0.0.0 --port $ES_PORT"

if is_running "$ES_PID"; then
    echo "      ✓ ElderSkill Voice Engine is already running (PID $(cat "$ES_PID")). Reusing."
else
    if ss -tuln | grep -q ":$ES_PORT "; then
        echo "Port $ES_PORT is already in use by another process."
        echo "Please stop that process or configure the service appropriately."
        exit 1
    fi
    cd "$REPO_ROOT/elderskill-voice-engine"
    eval "$ES_CMD" > "$ES_LOG" 2>&1 &
    echo "$!" > "$ES_PID"
    echo "      waiting for API..."
    if wait_for_health "ElderSkill Voice Engine" "http://localhost:$ES_PORT/health"; then
        echo "      ✓ Voice API ready"
    else
        echo "See logs at $ES_LOG"
        cleanup
    fi
fi


# 2. Pages
echo "[2/3] Starting Pages..."
PAGES_LOG="$LOGS_DIR/pages.log"
PAGES_PID="$RUN_DIR/pages.pid"
PAGES_PORT=""

if is_running "$PAGES_PID"; then
    echo "      ✓ Pages is already running (PID $(cat "$PAGES_PID")). Reusing."
    PAGES_PORT=$(grep -oP 'http://(localhost|127\.0\.0\.1):\K[0-9]+' "$PAGES_LOG" | head -n 1 || true)
else
    cd "$REPO_ROOT/pages"
    npm run dev > "$PAGES_LOG" 2>&1 &
    echo "$!" > "$PAGES_PID"
    echo "      waiting for service..."
    count=0
    while [ -z "$PAGES_PORT" ]; do
        PAGES_PORT=$(grep -oP 'http://(localhost|127\.0\.0\.1):\K[0-9]+' "$PAGES_LOG" | head -n 1 || true)
        if [ -n "$PAGES_PORT" ]; then break; fi
        if [ "$count" -ge 30 ]; then
            echo "      ✗ Pages failed to start or port not detected"
            echo "See logs at $PAGES_LOG"
            cleanup
        fi
        sleep 1
        count=$((count+1))
    done
    if wait_for_port "Pages" "$PAGES_PORT"; then
        echo "      ✓ Pages ready on port $PAGES_PORT"
    else
        echo "See logs at $PAGES_LOG"
        cleanup
    fi
fi


# 3. SilverHands App
echo "[3/3] Starting SilverHands..."
SH_LOG="$LOGS_DIR/silverhands-app.log"
SH_PID="$RUN_DIR/silverhands-app.pid"
SH_PORT=""

if is_running "$SH_PID"; then
    echo "      ✓ SilverHands App is already running (PID $(cat "$SH_PID")). Reusing."
    SH_PORT=$(grep -oP 'http://(localhost|127\.0\.0\.1):\K[0-9]+' "$SH_LOG" | head -n 1 || true)
else
    cd "$REPO_ROOT/silverhands-app"
    npm run dev > "$SH_LOG" 2>&1 &
    echo "$!" > "$SH_PID"
    echo "      waiting for application..."
    count=0
    while [ -z "$SH_PORT" ]; do
        SH_PORT=$(grep -oP 'http://(localhost|127\.0\.0\.1):\K[0-9]+' "$SH_LOG" | head -n 1 || true)
        if [ -n "$SH_PORT" ]; then break; fi
        if [ "$count" -ge 30 ]; then
            echo "      ✗ SilverHands failed to start or port not detected"
            echo "See logs at $SH_LOG"
            cleanup
        fi
        sleep 1
        count=$((count+1))
    done
    if wait_for_port "SilverHands" "$SH_PORT"; then
        echo "      ✓ SilverHands ready on port $SH_PORT"
    else
        echo "See logs at $SH_LOG"
        cleanup
    fi
fi

echo ""
echo "=================================================="
echo " SILVERHANDS PLATFORM"
echo "=================================================="
echo ""
echo "SilverHands App:"
echo "http://localhost:${SH_PORT:-Unknown}"
echo ""
echo "Pages:"
echo "http://localhost:${PAGES_PORT:-Unknown}"
echo ""
echo "ElderSkill Voice API:"
echo "http://localhost:$ES_PORT"
echo ""
echo "=================================================="
echo "All services are running."
echo "Press CTRL+C to stop all services."
echo "=================================================="

# Keep script running to handle signals
wait
