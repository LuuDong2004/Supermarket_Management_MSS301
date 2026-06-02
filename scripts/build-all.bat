@echo off
REM Build every module (shared libs first, then services) and install to the
REM local Maven repo. Run from anywhere; paths are resolved relative to repo root.
setlocal
cd /d "%~dp0.."
echo [build-all] Building all modules...
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [build-all] BUILD FAILED
    exit /b 1
)
echo [build-all] BUILD SUCCESS
endlocal
