@echo off
REM Build images and start the full dev stack (postgres, redis, discovery,
REM gateway, auth, user) in the background.
setlocal
cd /d "%~dp0.."
echo [start-dev] Starting MSS301 stack via docker compose...
docker compose up --build -d
if errorlevel 1 (
    echo [start-dev] Failed to start stack
    exit /b 1
)
echo [start-dev] Stack is starting.
echo   Eureka : http://localhost:8761
echo   Gateway: http://localhost:8080
echo   Swagger: http://localhost:8080/swagger-ui.html
endlocal
