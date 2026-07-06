@echo off
REM Flyway migrations run automatically on service startup (each DB-backed
REM service applies its own scripts from src/main/resources/db/migration).
REM
REM This helper forces a re-apply by rebuilding and restarting the DB-backed
REM services against a running mysql. Ensure 'mysql' is up first.
setlocal
cd /d "%~dp0.."
echo [migrate] Restarting DB-backed services to apply migrations...
docker compose up -d --build auth-service user-service
if errorlevel 1 (
    echo [migrate] Migration run failed
    exit /b 1
)
echo [migrate] Done. Check service logs for Flyway output:
echo   docker compose logs -f auth-service user-service
endlocal
