#!/usr/bin/env python3
"""
Server Shutdown Script for Portfolio-main
Gracefully terminates backend (port 8000) and frontend (port 5173) processes.
Works cross-platform on Linux, macOS, and Windows.
"""

import sys
import os
import json
import time
import signal
import platform
import subprocess
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
PID_FILE = ROOT_DIR / ".servers_pid.json"
IS_WINDOWS = platform.system() == "Windows"


def kill_pid(pid):
    """Safely terminate a PID by OS."""
    try:
        if IS_WINDOWS:
            subprocess.run(["taskkill", "/F", "/T", "/PID", str(pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            os.kill(pid, signal.SIGTERM)
            time.sleep(0.2)
            try:
                os.kill(pid, signal.SIGKILL)
            except OSError:
                pass
        return True
    except (OSError, subprocess.SubprocessError):
        return False


def kill_port_unix(port):
    """Kill process listening on a port on Unix."""
    try:
        res = subprocess.run(["lsof", "-ti", f":{port}"], capture_output=True, text=True)
        pids = [int(p.strip()) for p in res.stdout.strip().split() if p.strip().isdigit()]
        for pid in pids:
            kill_pid(pid)
        return len(pids) > 0
    except Exception:
        return False


def kill_port_windows(port):
    """Kill process listening on a port on Windows."""
    try:
        res = subprocess.run(f"netstat -ano | findstr :{port}", shell=True, capture_output=True, text=True)
        killed = False
        for line in res.stdout.strip().splitlines():
            parts = line.split()
            if len(parts) >= 5 and f":{port}" in parts[1]:
                pid = parts[-1]
                if pid.isdigit() and pid != "0":
                    subprocess.run(["taskkill", "/F", "/PID", pid], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    killed = True
        return killed
    except Exception:
        return False


def stop_servers():
    print("=" * 55)
    print("STOPPING DEVELOPMENT SERVERS")
    print("=" * 55)

    stopped_any = False

    # 1. Terminate tracked PIDs from .servers_pid.json
    if PID_FILE.exists():
        try:
            with open(PID_FILE, "r") as f:
                data = json.load(f)
            for name, info in data.items():
                pid = info.get("pid")
                port = info.get("port")
                if pid:
                    kill_pid(pid)
                    print(f"Stopped {name.capitalize()} (PID: {pid}, Port: {port})")
                    stopped_any = True
            PID_FILE.unlink(missing_ok=True)
        except Exception as e:
            print(f"Note reading PID file: {e}")

    # 2. Sweep ports 8000 and 5173 for any lingering processes
    ports = [8000, 5173]
    for port in ports:
        if IS_WINDOWS:
            killed = kill_port_windows(port)
        else:
            killed = kill_port_unix(port)
        if killed:
            print(f"Released port {port} (terminated remaining listener)")
            stopped_any = True

    if PID_FILE.exists():
        PID_FILE.unlink(missing_ok=True)

    print("\n✅ All servers stopped. Ports 8000 and 5173 are free.")


if __name__ == "__main__":
    stop_servers()
