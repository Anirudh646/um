@echo off
echo Starting UMS Backend and Frontend...

REM Start backend in new window
start "Backend Server" cmd /k "cd /d F:\ums && .\venv\Scripts\activate.bat && cd backend && python app.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend in new window  
start "Frontend Server" cmd /k "cd /d F:\ums\frontend && npm run dev"

echo Both servers are starting...
echo Backend: http://127.0.0.1:5000
echo Frontend: http://localhost:5173
pause
