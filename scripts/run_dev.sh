#!/usr/bin/env bash

# Cross-platform development runner for Linux/macOS
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $(jobs -p) 2>/dev/null
    wait $(jobs -p) 2>/dev/null
    echo "Development servers stopped."
}

trap cleanup EXIT INT TERM

# Detect Python virtualenv
PY_BIN="python3"
if [ -x "$ROOT_DIR/backend/.venv/bin/python" ]; then
    PY_BIN="$ROOT_DIR/backend/.venv/bin/python"
elif [ -x "$HOME/.cache/portfolio/venv/bin/python" ]; then
    PY_BIN="$HOME/.cache/portfolio/venv/bin/python"
elif [ -x "$ROOT_DIR/backend/venv/bin/python" ]; then
    PY_BIN="$ROOT_DIR/backend/venv/bin/python"
fi

echo "=========================================="
echo "Starting Backend (Django)..."
echo "Using Python: $PY_BIN"
echo "=========================================="
(cd "$ROOT_DIR/backend" && "$PY_BIN" manage.py runserver 127.0.0.1:8000) &

# Wait briefly for backend to bind
sleep 1

echo "=========================================="
echo "Starting Frontend (Vite)..."
echo "=========================================="
(cd "$ROOT_DIR/frontend" && npm run dev) &

# Wait for background processes
wait
