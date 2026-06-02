@echo off
REM Stop the dev stack. Pass --wipe to also delete volumes (databases, redis).
setlocal
cd /d "%~dp0.."
if "%1"=="--wipe" (
    echo [stop-dev] Stopping stack and removing volumes...
    docker compose down -v
) else (
    echo [stop-dev] Stopping stack (volumes preserved)...
    docker compose down
)
endlocal
