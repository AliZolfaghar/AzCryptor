@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"

echo === AzCryptor local install and test ===
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not in PATH.
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo ERROR: npm is not installed or not in PATH.
  exit /b 1
)

if not exist "package.json" (
  echo ERROR: package.json not found in %cd%
  exit /b 1
)

for /f "usebackq delims=" %%A in (`node -p "require('./package.json').name"`) do set PKG_NAME=%%A
for /f "usebackq delims=" %%A in (`node -p "require('./package.json').version"`) do set PKG_VERSION=%%A

echo Package: %PKG_NAME%@%PKG_VERSION%
echo.

echo [1/4] npm install
call npm install
if errorlevel 1 (
  echo ERROR: npm install failed.
  exit /b 1
)

echo.
echo [2/4] Update global CLI from this folder
call npm install -g .
if errorlevel 1 (
  echo ERROR: npm install -g . failed.
  exit /b 1
)

echo.
echo [3/4] Smoke test
where azcryptor >nul 2>&1
if errorlevel 1 (
  echo ERROR: azcryptor is not on PATH after global install.
  exit /b 1
)

call azcryptor --version
if errorlevel 1 (
  echo ERROR: azcryptor --version failed.
  exit /b 1
)

call azcryptor --help >nul
if errorlevel 1 (
  echo ERROR: azcryptor --help failed.
  exit /b 1
)

set "TMPDIR=%TEMP%\azcryptor-local-test"
if exist "%TMPDIR%" rmdir /s /q "%TMPDIR%"
mkdir "%TMPDIR%"
mkdir "%TMPDIR%\meta"

echo local-test > "%TMPDIR%\sample.txt"

call azcryptor encrypt -i "%TMPDIR%\sample.txt" -o "%TMPDIR%\sample.enc" -m "%TMPDIR%\meta"
if errorlevel 1 (
  echo ERROR: encrypt smoke test failed.
  exit /b 1
)

call azcryptor decrypt -i "%TMPDIR%\sample.enc" -o "%TMPDIR%\sample.out" -m "%TMPDIR%\meta"
if errorlevel 1 (
  echo ERROR: decrypt smoke test failed.
  exit /b 1
)

call azcryptor base64ify "%TMPDIR%\sample.txt" >nul
if errorlevel 1 (
  echo ERROR: base64ify smoke test failed.
  exit /b 1
)

echo.
echo [4/4] Cleanup temp files
rmdir /s /q "%TMPDIR%"

echo.
echo Local install ready: %PKG_NAME%@%PKG_VERSION%
echo Try: azcryptor --help
exit /b 0
