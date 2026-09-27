@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"

echo === AzCryptor npm publish ===
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
echo [2/4] Checking npm login
for /f "usebackq delims=" %%A in (`npm whoami 2^>nul`) do set NPM_USER=%%A
if not defined NPM_USER (
  echo ERROR: Not logged in to npm. Run: npm login
  exit /b 1
)
echo Logged in as: %NPM_USER%

echo.
echo [3/4] npm pack --dry-run
call npm pack --dry-run
if errorlevel 1 (
  echo ERROR: npm pack --dry-run failed.
  exit /b 1
)

echo.
echo About to publish %PKG_NAME%@%PKG_VERSION%
set /p CONFIRM=Continue with npm publish? [Y/N]: 
if /I not "%CONFIRM%"=="Y" (
  echo Publish cancelled.
  exit /b 0
)

echo.
echo [4/4] npm publish
call npm publish
if errorlevel 1 (
  echo ERROR: npm publish failed.
  exit /b 1
)

echo.
echo Published successfully: %PKG_NAME%@%PKG_VERSION%
exit /b 0
