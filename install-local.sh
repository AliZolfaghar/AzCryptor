#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "=== AzCryptor local install and test ==="
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
echo "[2/4] Update global CLI from this folder"
npm install -g .

echo
echo "[3/4] Smoke test"
if ! command -v azcryptor >/dev/null 2>&1; then
  echo "ERROR: azcryptor is not on PATH after global install."
  exit 1
fi

azcryptor --version
azcryptor --help >/dev/null

TMPDIR="$(mktemp -d "${TMPDIR:-/tmp}/azcryptor-local-test.XXXXXX")"
mkdir -p "${TMPDIR}/meta"
printf 'local-test\n' > "${TMPDIR}/sample.txt"

azcryptor encrypt -i "${TMPDIR}/sample.txt" -o "${TMPDIR}/sample.enc" -m "${TMPDIR}/meta"
azcryptor decrypt -i "${TMPDIR}/sample.enc" -o "${TMPDIR}/sample.out" -m "${TMPDIR}/meta"
azcryptor base64ify "${TMPDIR}/sample.txt" >/dev/null

echo
echo "[4/4] Cleanup temp files"
rm -rf "${TMPDIR}"

echo
echo "Local install ready: ${PKG_NAME}@${PKG_VERSION}"
echo "Try: azcryptor --help"
