#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "=== AzCryptor npm publish ==="
echo

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js is not installed or not in PATH."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm is not installed or not in PATH."
  exit 1
fi

if [[ ! -f package.json ]]; then
  echo "ERROR: package.json not found in $(pwd)"
  exit 1
fi

PKG_NAME="$(node -p "require('./package.json').name")"
PKG_VERSION="$(node -p "require('./package.json').version")"

echo "Package: ${PKG_NAME}@${PKG_VERSION}"
echo

echo "[1/4] npm install"
npm install

echo
echo "[2/4] Checking npm login"
if ! NPM_USER="$(npm whoami 2>/dev/null)"; then
  echo "ERROR: Not logged in to npm. Run: npm login"
  exit 1
fi
echo "Logged in as: ${NPM_USER}"

echo
echo "[3/4] npm pack --dry-run"
npm pack --dry-run

echo
echo "About to publish ${PKG_NAME}@${PKG_VERSION}"
read -r -p "Continue with npm publish? [Y/N]: " CONFIRM
if [[ ! "${CONFIRM}" =~ ^[Yy]$ ]]; then
  echo "Publish cancelled."
  exit 0
fi

echo
echo "[4/4] npm publish"
npm publish

echo
echo "Published successfully: ${PKG_NAME}@${PKG_VERSION}"
