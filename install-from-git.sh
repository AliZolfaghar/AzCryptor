#!/usr/bin/env bash
set -euo pipefail

# Install AzCryptor from Git (no npm registry package required).
# Usage:
#   ./install-from-git.sh
#   ./install-from-git.sh ~/tools/AzCryptor
#   ./install-from-git.sh ~/tools/AzCryptor https://github.com/AliZolfaghar/AzCryptor.git

REPO_URL="${2:-https://github.com/AliZolfaghar/AzCryptor.git}"
DEST="${1:-$HOME/AzCryptor}"

echo "=== AzCryptor install from Git ==="
echo "Repo: ${REPO_URL}"
echo "Dest: ${DEST}"
echo

if ! command -v git >/dev/null 2>&1; then
  echo "ERROR: git is not installed or not in PATH."
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js is not installed or not in PATH."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm CLI is not installed or not in PATH."
  echo "Note: this installs from Git source, not from the azcryptor npm package."
  exit 1
fi

if [[ -f "${DEST}/package.json" ]]; then
  echo "[1/4] Existing checkout found. Updating..."
  cd "${DEST}"
  if ! git pull --ff-only; then
    echo "WARNING: git pull failed. Continuing with current files..."
  fi
else
  echo "[1/4] Cloning repository..."
  if [[ -e "${DEST}" ]]; then
    echo "ERROR: \"${DEST}\" exists but is not an AzCryptor checkout."
    exit 1
  fi
  git clone "${REPO_URL}" "${DEST}"
  cd "${DEST}"
fi

if [[ ! -f package.json ]]; then
  echo "ERROR: package.json not found in $(pwd)"
  exit 1
fi

PKG_NAME="$(node -p "require('./package.json').name")"
PKG_VERSION="$(node -p "require('./package.json').version")"
echo "Package: ${PKG_NAME}@${PKG_VERSION}"
echo

echo "[2/4] npm install (project dependencies)"
npm install

echo
echo "[3/4] Install global CLI from this checkout"
npm install -g .

echo
echo "[4/4] Verify"
if ! command -v azcryptor >/dev/null 2>&1; then
  echo "ERROR: azcryptor is not on PATH after install."
  exit 1
fi

azcryptor --version

echo
echo "Installed from Git: ${PKG_NAME}@${PKG_VERSION}"
echo "Source: $(pwd)"
echo "Try: azcryptor --help"
