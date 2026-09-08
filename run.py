#!/usr/bin/env python3
"""
Cross-Platform Development & Setup Runner for Portfolio-main
Works on Linux, macOS, and Windows with zero external Python dependencies.
"""

import os
import sys
import platform
import subprocess
import signal
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"
IS_WINDOWS = platform.system() == "Windows"
CACHE_DIR = Path.home() / ".cache" / "portfolio"


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

    # Fallback to system Python
    return sys.executable


def get_npm_cmd():
    """Return npm command suitable for OS shell."""
    return "npm.cmd" if IS_WINDOWS else "npm"


def clear_stale_servers():
    """Stop any existing Portfolio app processes using the reserved dev ports."""
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


def run_setup():
    """Perform initial environment setup for backend and frontend."""
    print("=" * 50)
    print("PORTFOLIO CROSS-PLATFORM SETUP")
    print(f"Detected OS: {platform.system()} ({platform.machine()})")
    print("=" * 50)

    # 1. Setup Backend Python Virtual Environment
    print("\n[1/3] Setting up Python virtual environment for backend...")
    req_file = BACKEND_DIR / "requirements.txt"
    if not req_file.exists():
        print(f"Error: {req_file} not found!")
        sys.exit(1)

    py_bin = None
    if IS_WINDOWS:
        venv_dir = BACKEND_DIR / "venv"
        if not venv_dir.exists():
            print("Creating Windows virtual environment at backend/venv...")
            subprocess.run([sys.executable, "-m", "venv", str(venv_dir)], check=True)
        py_bin = str(venv_dir / "Scripts" / "python.exe")
    else:
        # On Linux with NTFS mounts, native so mapping requires native filesystem
        native_venv = CACHE_DIR / "venv"
        native_venv.parent.mkdir(parents=True, exist_ok=True)
        if not native_venv.exists():
            print(f"Creating Linux virtual environment at {native_venv}...")
            subprocess.run([sys.executable, "-m", "venv", str(native_venv)], check=True)

        symlink_target = BACKEND_DIR / ".venv"
        if symlink_target.is_symlink() or symlink_target.exists():
            symlink_target.unlink() if symlink_target.is_symlink() else None
        if not symlink_target.exists():
            try:
                symlink_target.symlink_to(native_venv)
                print(f"Created symlink backend/.venv -> {native_venv}")
            except Exception as e:
                print(f"Note: Symlink creation note: {e}")

        py_bin = str(native_venv / "bin" / "python")

    print(f"Using Python: {py_bin}")
    print("Installing backend requirements...")
    subprocess.run([py_bin, "-m", "pip", "install", "-r", str(req_file)], check=True)

    # 2. Run Migrations
    print("\n[2/3] Running Django migrations...")
    subprocess.run([py_bin, "manage.py", "migrate"], cwd=str(BACKEND_DIR), check=True)

    # 3. Setup Frontend
    print("\n[3/3] Setting up frontend dependencies...")
    if not IS_WINDOWS:
        # Set up ext4 node_modules link if not already linked
        native_nm = CACHE_DIR / "frontend" / "node_modules"
        native_nm.parent.mkdir(parents=True, exist_ok=True)
        link_nm = FRONTEND_DIR / "node_modules"
        if not link_nm.exists() and not link_nm.is_symlink():
            if not native_nm.exists():
                native_nm.mkdir(parents=True, exist_ok=True)
            link_nm.symlink_to(native_nm)
            print(f"Created symlink frontend/node_modules -> {native_nm}")

    npm_cmd = get_npm_cmd()
    subprocess.run([npm_cmd, "install"], cwd=str(FRONTEND_DIR), check=True)

    print("\nSetup complete! You can now start development with:")
    print("   python run.py dev")


def prepare_environment():
    """Ensure node_modules and virtualenvs are aligned with current OS."""
    nm = FRONTEND_DIR / "node_modules"
    nm_win = FRONTEND_DIR / "node_modules_win"

    if IS_WINDOWS:
        # If running on Windows and node_modules is a Linux symlink, restore Windows directory
        if nm_win.exists():
            try:
                if nm.is_symlink():
                    nm.unlink()
                if not nm.exists():
                    nm_win.rename(nm)
            except Exception:
                pass
    else:
        # If running on Linux and node_modules is a real folder from Windows, preserve it
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


def run_dev(backend_only=False, frontend_only=False):
    """Run backend and/or frontend servers concurrently with graceful exit."""
    clear_stale_servers()
    prepare_environment()
    processes = []

    def shutdown(signum=None, frame=None):
        print("\nStopping development servers...")
        for p in processes:
            if p.poll() is None:
                p.terminate()
        time.sleep(0.5)
        for p in processes:
            if p.poll() is None:
                p.kill()
        print("Servers stopped cleanly.")
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    py_bin = get_backend_python()
    npm_cmd = get_npm_cmd()

    print("=" * 50)
    print("STARTING DEVELOPMENT SERVERS")
    print("Press Ctrl+C to stop all servers.")
    print("=" * 50)

    try:
        if not frontend_only:
            print(f"[Backend] Starting Django API on http://127.0.0.1:8000 ...")
            backend_proc = subprocess.Popen(
                [py_bin, "manage.py", "runserver", "127.0.0.1:8000"],
                cwd=str(BACKEND_DIR)
            )
            processes.append(backend_proc)

        if not backend_only:
            print(f"[Frontend] Starting Vite Dev Server on http://localhost:5173 ...")
            frontend_proc = subprocess.Popen(
                [npm_cmd, "run", "dev"],
                cwd=str(FRONTEND_DIR)
            )
            processes.append(frontend_proc)

        # Monitor processes
        while True:
            for p in processes:
                ret = p.poll()
                if ret is not None:
                    print(f"A server process exited unexpectedly with code {ret}.")
                    shutdown()
            time.sleep(1)

    except KeyboardInterrupt:
        shutdown()


if __name__ == "__main__":
    action = sys.argv[1] if len(sys.argv) > 1 else "dev"

    if action == "dev":
        backend_only = "--backend-only" in sys.argv
        frontend_only = "--frontend-only" in sys.argv
        run_dev(backend_only=backend_only, frontend_only=frontend_only)
    elif action == "start":
        # Delegate to start.py
        subprocess.run([sys.executable, str(ROOT_DIR / "start.py")] + sys.argv[2:])
    elif action == "stop":
        # Delegate to stop.py
        subprocess.run([sys.executable, str(ROOT_DIR / "stop.py")])
    elif action == "test":
        # Delegate to test.py
        result = subprocess.run([sys.executable, str(ROOT_DIR / "test.py")])
        sys.exit(result.returncode)
    elif action == "push":
        # Delegate to verify_and_push.py
        result = subprocess.run([sys.executable, str(ROOT_DIR / "verify_and_push.py")] + sys.argv[2:])
        sys.exit(result.returncode)
    elif action == "setup":
        run_setup()
    elif action == "check":
        py_bin = get_backend_python()
        print("Checking Backend...")
        subprocess.run([py_bin, "manage.py", "check"], cwd=str(BACKEND_DIR), check=True)
        print("\nChecking Frontend Build...")
        npm_cmd = get_npm_cmd()
        subprocess.run([npm_cmd, "run", "build"], cwd=str(FRONTEND_DIR), check=True)
        print("\nAll checks passed successfully!")
    else:
        print("Usage:")
        print("  python run.py dev                    # Start both backend & frontend (foreground)")
        print("  python run.py dev --backend-only     # Start only Django API")
        print("  python run.py dev --frontend-only    # Start only Vite frontend")
        print("  python run.py start --background     # Start servers in background")
        print("  python run.py stop                   # Stop all running servers")
        print("  python run.py test                   # Run full 3-tier verification suite")
        print("  python run.py push                   # Verify + commit + push to git")
        print("  python run.py push --dry-run         # Verify + stage only, no push")
        print("  python run.py push --branch main     # Push to 'main' branch")
        print("  python run.py push --message 'feat'  # Push with custom commit message")
        print("  python run.py setup                  # Setup venv and install dependencies")
        print("  python run.py check                  # Quick build check")
        sys.exit(1)
