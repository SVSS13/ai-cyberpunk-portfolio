#!/usr/bin/env bash

# Cross-platform Backend Setup for Linux/macOS
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CACHE_DIR="$HOME/.cache/portfolio"

echo "=========================================="
echo "Setting up Django backend..."
echo "=========================================="

mkdir -p "$CACHE_DIR"
VENV_DIR="$CACHE_DIR/venv"

if [ ! -d "$VENV_DIR" ]; then
    echo "Creating Python virtual environment in $VENV_DIR ..."
    python3 -m venv "$VENV_DIR"
fi

# Ensure symlink in backend/.venv
if [ ! -L "$ROOT_DIR/backend/.venv" ]; then
    rm -rf "$ROOT_DIR/backend/.venv" 2>/dev/null || true
    ln -s "$VENV_DIR" "$ROOT_DIR/backend/.venv"
    echo "Linked backend/.venv -> $VENV_DIR"
fi

PY_BIN="$VENV_DIR/bin/python"

echo "Installing backend dependencies..."
"$PY_BIN" -m pip install -r "$ROOT_DIR/backend/requirements.txt"

echo "Applying migrations..."
(cd "$ROOT_DIR/backend" && "$PY_BIN" manage.py migrate)

echo "Backend setup complete."
