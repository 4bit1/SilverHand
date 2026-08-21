#!/usr/bin/env bash
# scripts/stop.sh
# Stops the SilverHands platform safely.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_DIR="$REPO_ROOT/.run"

stop_process() {
    local name=$1
    local pidfile=$2
    
    echo "Stopping $name..."
    if [ -f "$pidfile" ]; then
        local pid=$(cat "$pidfile")
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
            
            # Wait for it to stop
            local count=0
            while kill -0 "$pid" 2>/dev/null; do
                if [ "$count" -ge 10 ]; then
                    kill -9 "$pid" 2>/dev/null || true
                    break
                fi
                sleep 0.5
                count=$((count+1))
            done
            echo "✓ stopped"
        else
            echo "✓ already stopped (process not found)"
        fi
        rm -f "$pidfile"
    else
        echo "✓ already stopped (no pid file)"
    fi
}

echo ""
stop_process "SilverHands" "$RUN_DIR/silverhands-app.pid"
echo ""
stop_process "Pages" "$RUN_DIR/pages.pid"
echo ""
stop_process "ElderSkill Voice Engine" "$RUN_DIR/elderskill-voice-engine.pid"
echo ""
echo "SilverHands Platform stopped."
