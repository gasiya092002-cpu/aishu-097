@echo off
echo =========================================================
echo    AI Image Studio - Intelligent Image Generation Agent
echo =========================================================
echo.
echo Starting Unified Production Server on http://localhost:8000 ...
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
pause
