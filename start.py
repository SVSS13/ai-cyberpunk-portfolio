#!/usr/bin/env python3
"""
Server Startup Script for Portfolio-main
Starts Django Backend (port 8000) and Vite Frontend (port 5173).
Supports both foreground mode and background (--background / -b) mode.
"""

import sys
import os
import json
import time
import signal
import socket
import platform
import subprocess
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"
PID_FILE = ROOT_DIR / ".servers_pid.json"
IS_WINDOWS = platform.system() == "Windows"
CACHE_DIR = Path.home() / ".cache" / "portfolio"


def is_port_open(host, port, timeout=0.5):
    """Check if a network port is accepting connections."""
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(timeout)
    try:
        s.connect((host, port))
        s.close()
        return True
    except (socket.timeout, ConnectionRefusedError, OSError):
        return False


def get_backend_python():
    """Detect the correct virtualenv Python executable for current OS."""
    candidates = []
    if IS_WINDOWS:
        candidates = [
            BACKEND_DIR / "venv" / "Scripts" / "python.exe",
            BACKEND_DIR / ".venv" / "Scripts" / "python.exe",
        ]
    else:
        candidates = [
            BACKEND_DIR / ".venv" / "bin" / "python",
            CACHE_DIR / "venv" / "bin" / "python",
            BACKEND_DIR / "venv" / "bin" / "python",
        ]

    for candidate in candidates:
        if candidate.is_file():
            return str(candidate)

    return sys.executable


def get_npm_cmd():
    return "npm.cmd" if IS_WINDOWS else "npm"


def clear_stale_servers():
    """Stop stale Portfolio dev servers before starting fresh."""
    for port in (8000, 5173):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.5)
        try:
            s.connect(("127.0.0.1", port))
            print(f"Detected a server already using port {port}. Clearing stale Portfolio processes...")
            subprocess.run([sys.executable, str(ROOT_DIR / "stop.py")], check=False)
            return
        except OSError:
            pass
        finally:
            s.close()


def prepare_environment():
    """Ensure proper node_modules and venv links on Linux / Windows."""
    nm = FRONTEND_DIR / "node_modules"
    nm_win = FRONTEND_DIR / "node_modules_win"

    if IS_WINDOWS:
        if nm_win.exists():
            try:
                if nm.is_symlink():
                    nm.unlink()
                if not nm.exists():
                    nm_win.rename(nm)
            except Exception:
                pass
    else:
        native_nm = CACHE_DIR / "frontend" / "node_modules"
        native_nm.parent.mkdir(parents=True, exist_ok=True)
        if nm.exists() and not nm.is_symlink():
            if not nm_win.exists():
                try:
                    nm.rename(nm_win)
                except Exception:
                    pass
        if not nm.exists() and not nm.is_symlink():
            if native_nm.exists():
                try:
                    nm.symlink_to(native_nm)
                except Exception:
                    pass


def start_foreground(backend_only=False, frontend_only=False):
    """Start servers interactively in foreground."""
    clear_stale_servers()
    prepare_environment()
    processes = []

    def shutdown(signum=None, frame=None):
        print("\n[start.py] Shutting down development servers...")
        for p in processes:
            if p.poll() is None:
                p.terminate()
        time.sleep(0.5)
        for p in processes:
            if p.poll() is None:
                p.kill()
        if PID_FILE.exists():
            PID_FILE.unlink(missing_ok=True)
        print("[start.py] All servers stopped cleanly.")
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    py_bin = get_backend_python()
    npm_cmd = get_npm_cmd()

    print("=" * 55)
    print("STARTING DEVELOPMENT SERVERS (Foreground)")
    print("Press Ctrl+C to stop all servers.")
    print("=" * 55)

    if not frontend_only:
        print("[Backend] Starting Django API on http://127.0.0.1:8000 ...")
        p_back = subprocess.Popen(
            [py_bin, "manage.py", "runserver", "127.0.0.1:8000"],
            cwd=str(BACKEND_DIR)
        )
        processes.append(p_back)

    if not backend_only:
        print("[Frontend] Starting Vite Dev Server on http://localhost:5173 ...")
        p_front = subprocess.Popen(
            [npm_cmd, "run", "dev"],
            cwd=str(FRONTEND_DIR)
        )
        processes.append(p_front)

    try:
        while True:
            for p in processes:
                ret = p.poll()
                if ret is not None:
                    print(f"[start.py] A server process exited with code {ret}.")
                    shutdown()
            time.sleep(1)
    except KeyboardInterrupt:
        shutdown()


def start_background(backend_only=False, frontend_only=False):
    """Start servers in the background and record their PIDs."""
    clear_stale_servers()
    prepare_environment()

    # Check if ports already occupied
    if not frontend_only and is_port_open("127.0.0.1", 8000):
        print("Warning: Port 8000 (Backend) is already in use!")
    if not backend_only and is_port_open("127.0.0.1", 5173):
        print("Warning: Port 5173 (Frontend) is already in use!")

    py_bin = get_backend_python()
    npm_cmd = get_npm_cmd()

    log_dir = ROOT_DIR / ".logs"
    log_dir.mkdir(exist_ok=True)

    back_log = open(log_dir / "backend.log", "w")
    front_log = open(log_dir / "frontend.log", "w")

    pid_data = {}

    print("=" * 55)
    print("STARTING DEVELOPMENT SERVERS (Background)")
    print("=" * 55)

    if not frontend_only:
        print("[Backend] Launching Django API...")
        p_back = subprocess.Popen(
            [py_bin, "manage.py", "runserver", "127.0.0.1:8000"],
            cwd=str(BACKEND_DIR),
            stdout=back_log,
            stderr=back_log,
            start_new_session=True if not IS_WINDOWS else False
        )
        pid_data["backend"] = {
            "pid": p_back.pid,
            "port": 8000,
            "url": "http://127.0.0.1:8000/api/"
        }

    if not backend_only:
        print("[Frontend] Launching Vite Dev Server...")
        p_front = subprocess.Popen(
            [npm_cmd, "run", "dev"],
            cwd=str(FRONTEND_DIR),
            stdout=front_log,
            stderr=front_log,
            start_new_session=True if not IS_WINDOWS else False
        )
        pid_data["frontend"] = {
            "pid": p_front.pid,
            "port": 5173,
            "url": "http://localhost:5173"
        }

    with open(PID_FILE, "w") as f:
        json.dump(pid_data, f, indent=2)

    # Wait for servers to become ready
    print("Waiting for servers to initialize...")
    for _ in range(25):
        b_ready = True if frontend_only else is_port_open("127.0.0.1", 8000)
        f_ready = True if backend_only else is_port_open("127.0.0.1", 5173)
        if b_ready and f_ready:
            break
        time.sleep(0.3)

    print("\n✅ Servers started successfully in the background!")
    if "backend" in pid_data:
        print(f"   • Backend API:  http://127.0.0.1:8000/api/ (PID: {pid_data['backend']['pid']})")
    if "frontend" in pid_data:
        print(f"   • Frontend UI:  http://localhost:5173/    (PID: {pid_data['frontend']['pid']})")
    print(f"\nTo stop the servers at any time, run:")
    print("   python stop.py")


if __name__ == "__main__":
    is_bg = "--background" in sys.argv or "-b" in sys.argv
    b_only = "--backend-only" in sys.argv
    f_only = "--frontend-only" in sys.argv

    if is_bg:
        start_background(backend_only=b_only, frontend_only=f_only)
    else:
        start_foreground(backend_only=b_only, frontend_only=f_only)
