#!/usr/bin/env bash

# Cross-platform Frontend Setup for Linux/macOS
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CACHE_DIR="$HOME/.cache/portfolio/frontend"

echo "=========================================="
echo "Setting up React frontend..."
echo "=========================================="

mkdir -p "$CACHE_DIR"
NM_DIR="$CACHE_DIR/node_modules"

if [ ! -L "$ROOT_DIR/frontend/node_modules" ]; then
    if [ -d "$ROOT_DIR/frontend/node_modules" ] && [ ! -d "$ROOT_DIR/frontend/node_modules_win" ]; then
        echo "Backing up Windows node_modules to frontend/node_modules_win..."
        mv "$ROOT_DIR/frontend/node_modules" "$ROOT_DIR/frontend/node_modules_win"
    fi
    mkdir -p "$NM_DIR"
    rm -rf "$ROOT_DIR/frontend/node_modules" 2>/dev/null || true
    ln -s "$NM_DIR" "$ROOT_DIR/frontend/node_modules"
    echo "Linked frontend/node_modules -> $NM_DIR"
fi

echo "Installing npm dependencies..."
(cd "$ROOT_DIR/frontend" && npm install)

echo "Frontend setup complete."
