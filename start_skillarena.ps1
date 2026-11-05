Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host " Starting SkillArena AI (Python AI Engine + React Web Platform) " -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ai-engine'; python server.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev -- --host 0.0.0.0 --port 5173"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ssh -o StrictHostKeyChecking=no -R 80:127.0.0.1:5173 nokey@localhost.run"

Write-Host "`nSkillArena AI services initiated!" -ForegroundColor Green
Write-Host "Web Platform:  http://localhost:5173" -ForegroundColor Yellow
Write-Host "AI Microservice: http://localhost:8000" -ForegroundColor Yellow

Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

