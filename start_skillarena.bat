@echo off
echo ====================================================================
echo  Starting SkillArena AI (Python AI Engine + React Web Platform)
echo ====================================================================

start "SkillArena AI Microservice" cmd /k "cd ai-engine && python server.py"
start "SkillArena React Platform" cmd /k "cd frontend && npm run dev -- --host 0.0.0.0 --port 5173"
start "SkillArena Public Internet Tunnel" cmd /k "ssh -o StrictHostKeyChecking=no -R 80:127.0.0.1:5173 nokey@localhost.run"

echo.
echo ====================================================================
echo  SkillArena AI is running!
echo  Web Platform: http://localhost:5173
echo  AI Microservice: http://localhost:8000
echo ====================================================================
timeout /t 5
start http://localhost:5173

