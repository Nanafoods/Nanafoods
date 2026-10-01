@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start http://127.0.0.1:5500/
  py -m http.server 5500
) else (
  echo Python nao encontrado. Use o Live Server do VS Code.
  pause
)
