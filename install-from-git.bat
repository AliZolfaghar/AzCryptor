@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Install AzCryptor from Git (no npm registry package required).
REM Usage:
REM   install-from-git.bat
REM   install-from-git.bat "D:\tools\AzCryptor"
REM   install-from-git.bat "D:\tools\AzCryptor" "https://github.com/AliZolfaghar/AzCryptor.git"

set "REPO_URL=https://github.com/AliZolfaghar/AzCryptor.git"
set "DEST=%USERPROFILE%\AzCryptor"

if not "%~1"=="" set "DEST=%~1"
if not "%~2"=="" set "REPO_URL=%~2"

echo === AzCryptor install from Git ===
echo Repo: %REPO_URL%
echo Dest: %DEST%
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo ERROR: git is not installed or not in PATH.
  exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not in PATH.
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo ERROR: npm CLI is not installed or not in PATH.
  echo Note: this installs from Git source, not from the azcryptor npm package.
  exit /b 1
)

if exist "%DEST%\package.json" (
  echo [1/4] Existing checkout found. Updating...
  pushd "%DEST%"
  git pull --ff-only
  if errorlevel 1 (
    echo WARNING: git pull failed. Continuing with current files...
  )
) else (
  echo [1/4] Cloning repository...
  if exist "%DEST%" (
    echo ERROR: "%DEST%" exists but is not an AzCryptor checkout.
    exit /b 1
  )
  git clone "%REPO_URL%" "%DEST%"
  if errorlevel 1 (
    echo ERROR: git clone failed.
    exit /b 1
  )
  pushd "%DEST%"
)

if not exist "package.json" (
  echo ERROR: package.json not found in %cd%
  popd
  exit /b 1
)

for /f "usebackq delims=" %%A in (`node -p "require('./package.json').name"`) do set PKG_NAME=%%A
for /f "usebackq delims=" %%A in (`node -p "require('./package.json').version"`) do set PKG_VERSION=%%A
echo Package: %PKG_NAME%@%PKG_VERSION%
echo.

echo [2/4] npm install ^(project dependencies^)
call npm install
if errorlevel 1 (
  echo ERROR: npm install failed.
  popd
  exit /b 1
)

echo.
echo [3/4] Install global CLI from this checkout
call npm install -g .
if errorlevel 1 (
  echo ERROR: npm install -g . failed.
  popd
  exit /b 1
)

echo.
echo [4/4] Verify
where azcryptor >nul 2>&1
if errorlevel 1 (
  echo ERROR: azcryptor is not on PATH after install.
  popd
  exit /b 1
)

call azcryptor --version
if errorlevel 1 (
  echo ERROR: azcryptor --version failed.
  popd
  exit /b 1
)

echo.
echo Installed from Git: %PKG_NAME%@%PKG_VERSION%
echo Source: %cd%
echo Try: azcryptor --help
popd
exit /b 0
