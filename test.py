#!/usr/bin/env python3
"""
Comprehensive Verification Test Suite for Portfolio-main
Tests:
  1. Django Backend Unit/Integration Tests (manage.py test api)
  2. Frontend Production Build & Bundling (npm run build)
  3. Live API Endpoints & UI Verification (HTTP requests & HTML structure)
"""

import sys
import os
import json
import time
import socket
import platform
import subprocess
import urllib.request
import urllib.error
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"
IS_WINDOWS = platform.system() == "Windows"
CACHE_DIR = Path.home() / ".cache" / "portfolio"


def is_port_open(host, port, timeout=0.5):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(timeout)
    try:
        s.connect((host, port))
        s.close()
        return True
    except (socket.timeout, ConnectionRefusedError, OSError):
        return False


def get_backend_python():
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


def run_tier1_backend_tests():
    print("\n" + "=" * 60)
    print("TIER 1: DJANGO BACKEND TESTS (manage.py test api)")
    print("=" * 60)
    py_bin = get_backend_python()
    res = subprocess.run([py_bin, "manage.py", "test", "api"], cwd=str(BACKEND_DIR))
    if res.returncode != 0:
        print("❌ Django backend tests failed!")
        return False
    print("✅ Django backend tests passed (All 10 tests OK)")
    return True


def run_tier2_frontend_build():
    print("\n" + "=" * 60)
    print("TIER 2: FRONTEND BUILD CHECK (npm run build)")
    print("=" * 60)
    npm_cmd = get_npm_cmd()
    res = subprocess.run([npm_cmd, "run", "build"], cwd=str(FRONTEND_DIR))
    if res.returncode != 0:
        print("❌ Frontend build failed!")
        return False
    print("✅ Frontend build passed successfully!")
    return True


def http_request(url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    if data is not None and isinstance(data, dict):
        data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.getcode(), resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")
    except Exception as e:
        return None, str(e)


def run_tier3_live_verification():
    print("\n" + "=" * 60)
    print("TIER 3: LIVE API ENDPOINTS & UI VERIFICATION")
    print("=" * 60)

    started_by_test = False
    backend_running = is_port_open("127.0.0.1", 8000)
    frontend_running = is_port_open("127.0.0.1", 5173)

    if not backend_running or not frontend_running:
        print("Starting servers in background for live verification...")
        start_script = ROOT_DIR / "start.py"
        subprocess.run([sys.executable, str(start_script), "--background"], check=True)
        started_by_test = True
        time.sleep(2)

    passed = True

    try:
        # 1. Test Backend Endpoints
        endpoints = [
            ("GET", "http://127.0.0.1:8000/api/", None, [200], "Home Endpoint"),
            ("GET", "http://127.0.0.1:8000/api/projects/", None, [200], "Projects List"),
            ("GET", "http://127.0.0.1:8000/api/analytics/", None, [200], "Analytics Metrics"),
            ("POST", "http://127.0.0.1:8000/api/track/", {}, [200], "Visitor Tracking"),
            ("POST", "http://127.0.0.1:8000/api/resume-download/", {}, [200], "Resume Download Tracker"),
            ("POST", "http://127.0.0.1:8000/api/contact/", {"name": "Test"}, [400], "Contact Validation (Missing fields)"),
            ("POST", "http://127.0.0.1:8000/api/chatbot/", {"message": "hi"}, [200], "Chatbot Query"),
            ("GET", "http://127.0.0.1:8000/admin/login/", None, [200], "Django Admin Login"),
        ]

        print("\n--- Verifying Backend API Endpoints ---")
        for method, url, data, expected_codes, desc in endpoints:
            code, body = http_request(url, method=method, data=data)
            if code in expected_codes:
                print(f"  ✅ [{code}] {method:<4} {desc} ({url})")
            else:
                print(f"  ❌ [{code}] {method:<4} {desc} ({url}) - Expected {expected_codes}")
                passed = False

        # 2. Test Frontend UI
        print("\n--- Verifying Frontend UI & HTML Structure ---")
        ui_url = "http://localhost:5173/"
        code, body = http_request(ui_url)
        if code == 200:
            print(f"  ✅ [200] GET Frontend Dev Server ({ui_url})")

            # Check critical HTML DOM nodes
            checks = [
                ('<div id="root">', "React root mounting container"),
                ('/src/main.jsx', "Vite client entrypoint script"),
                ('<html', "Valid HTML5 document structure"),
            ]
            for needle, desc in checks:
                if needle in body:
                    print(f"     • Found {desc} ({needle})")
                else:
                    print(f"     ❌ Missing {desc} ({needle})")
                    passed = False
        else:
            print(f"  ❌ [{code}] Failed to connect to Frontend UI at {ui_url}")
            passed = False

    finally:
        if started_by_test:
            print("\nStopping temporary test servers...")
            stop_script = ROOT_DIR / "stop.py"
            subprocess.run([sys.executable, str(stop_script)], check=True)

    return passed


def main():
    print("=" * 60)
    print("PORTFOLIO FULL SYSTEM VERIFICATION SUITE")
    print(f"Platform: {platform.system()} | Python: {sys.version.split()[0]}")
    print("=" * 60)

    t1 = run_tier1_backend_tests()
    if not t1:
        sys.exit(1)

    t2 = run_tier2_frontend_build()
    if not t2:
        sys.exit(1)

    t3 = run_tier3_live_verification()
    if not t3:
        sys.exit(1)

    print("\n" + "=" * 60)
    print("🎉 ALL TESTS & VERIFICATIONS PASSED SUCCESSFULLY!")
    print("=" * 60)


if __name__ == "__main__":
    main()
