#!/usr/bin/env python3
"""
Verify & Push Pipeline for Portfolio-main
=========================================
Runs the full verification suite (test.py), then if all checks pass:
  1. Shows git diff summary
  2. Prompts for commit message (or accepts --message "...")
  3. Stages all changes
  4. Commits and pushes to the target remote branch

Usage:
  python verify_and_push.py                          # Full pipeline, interactive
  python verify_and_push.py --message "feat: update" # Skip commit prompt
  python verify_and_push.py --branch main            # Push to 'main' branch
  python verify_and_push.py --dry-run                # Test & stage only, no push
"""

import sys
import os
import subprocess
import platform
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
IS_WINDOWS = platform.system() == "Windows"


def run_cmd(cmd, cwd=None, capture=False):
    """Run shell command and return (returncode, stdout)."""
    result = subprocess.run(
        cmd,
        cwd=str(cwd) if cwd else str(ROOT_DIR),
        capture_output=capture,
        text=True,
        shell=False,
    )
    return result.returncode, result.stdout.strip() if capture else ""


def print_section(title):
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)


def run_tests():
    """Execute the full test.py verification suite."""
    print_section("STEP 1: RUNNING FULL VERIFICATION SUITE (test.py)")
    py = sys.executable
    result = subprocess.run([py, "test.py"], cwd=str(ROOT_DIR))
    return result.returncode == 0


def get_git_status():
    """Return git status summary."""
    _, out = run_cmd(["git", "status", "--short"], capture=True)
    return out


def get_git_diff_stat():
    """Return git diff --stat for staged/unstaged changes."""
    _, out = run_cmd(["git", "diff", "--stat"], capture=True)
    _, staged = run_cmd(["git", "diff", "--staged", "--stat"], capture=True)
    return out, staged


def stage_changes():
    """Stage all project files (excluding venv/node_modules/logs)."""
    print_section("STEP 2: STAGING CHANGES")

    # Stage tracked modified files + new relevant files
    files_to_add = [
        ".gitattributes",
        ".gitignore",
        "README.md",
        "run.py",
        "start.py",
        "stop.py",
        "test.py",
        "verify_and_push.py",
        "package.json",
        "backend/requirements.txt",
        "backend/api/tests.py",
        "backend/api/views.py",
        "backend/api/ai_engine.py",
        "backend/portfolio_backend/settings.py",
        "scripts/run_dev.sh",
        "scripts/backend_setup.sh",
        "scripts/frontend_setup.sh",
        "scripts/build_signed_apk.sh",
        "scripts/run_dev.bat",
        "scripts/backend_setup.bat",
        "scripts/frontend_setup.bat",
    ]

    staged = []
    skipped = []
    for f in files_to_add:
        fpath = ROOT_DIR / f
        if fpath.exists():
            code, _ = run_cmd(["git", "add", f])
            staged.append(f) if code == 0 else skipped.append(f)
        else:
            skipped.append(f + " (not found)")

    if staged:
        print("  Staged files:")
        for f in staged:
            print(f"    + {f}")
    if skipped:
        print("  Skipped (not found or error):")
        for f in skipped:
            print(f"    - {f}")

    _, staged_stat = get_git_diff_stat()
    if staged_stat:
        print(f"\n  Staged diff summary:\n{staged_stat}")

    return len(staged) > 0


def get_current_branch():
    """Return the current git branch name."""
    _, branch = run_cmd(["git", "rev-parse", "--abbrev-ref", "HEAD"], capture=True)
    return branch.strip()


def commit_and_push(message, branch, dry_run=False):
    """Commit staged changes and push to remote."""
    print_section("STEP 3: COMMIT & PUSH")

    # Commit
    code, _ = run_cmd(["git", "commit", "-m", message])
    if code != 0:
        _, status = run_cmd(["git", "status", "--short"], capture=True)
        if not status:
            print("  ℹ️  Nothing to commit — working tree is already clean.")
        else:
            print(f"  ❌ Commit failed (code {code})")
            return False

    print(f"  ✅ Committed: \"{message}\"")

    if dry_run:
        print("  🔁 [Dry Run] Skipping push.")
        return True

    # Push
    print(f"  Pushing to origin/{branch}...")
    code, _ = run_cmd(["git", "push", "origin", branch])
    if code != 0:
        print(f"  ❌ Push to origin/{branch} failed!")
        print("  Tip: Ensure you have push access to the remote and the branch exists.")
        return False

    print(f"  ✅ Pushed to origin/{branch} successfully!")
    return True


def main():
    args = sys.argv[1:]
    dry_run = "--dry-run" in args
    branch_flag = None
    commit_msg = None

    for i, arg in enumerate(args):
        if arg == "--branch" and i + 1 < len(args):
            branch_flag = args[i + 1]
        if arg == "--message" and i + 1 < len(args):
            commit_msg = args[i + 1]

    current_branch = get_current_branch()
    target_branch = branch_flag or current_branch

    print("=" * 60)
    print("  PORTFOLIO VERIFY & PUSH PIPELINE")
    print(f"  Branch: {current_branch} → push to: {target_branch}")
    if dry_run:
        print("  Mode: DRY RUN (no actual push)")
    print("=" * 60)

    # Step 1: Run full tests
    if not run_tests():
        print("\n❌ TESTS FAILED. Push aborted — fix the issues above first.")
        sys.exit(1)

    print("\n✅ All verifications passed! Proceeding to commit & push...")

    # Show current git status
    status = get_git_status()
    if status:
        print(f"\n  Changed files:\n{status}")
    else:
        print("\n  ℹ️  No file changes detected in working tree.")

    # Step 2: Stage changes
    staged_ok = stage_changes()

    # Step 3: Get commit message
    if not commit_msg:
        print()
        try:
            commit_msg = input("  Enter commit message (or press Enter for default): ").strip()
        except EOFError:
            commit_msg = ""
        if not commit_msg:
            commit_msg = "chore: cross-platform verified — all tests passed ✅"

    # Step 4: Commit & Push
    success = commit_and_push(commit_msg, target_branch, dry_run=dry_run)

    if success:
        print("\n" + "=" * 60)
        print("  🚀 PIPELINE COMPLETE!")
        print(f"  View on GitHub: https://github.com/SVSS13/ai-cyberpunk-portfolio/tree/{target_branch}")
        print("=" * 60)
    else:
        print("\n❌ Pipeline failed at push step.")
        sys.exit(1)


if __name__ == "__main__":
    main()
