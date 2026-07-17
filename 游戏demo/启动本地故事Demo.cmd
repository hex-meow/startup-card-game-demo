@echo off
chcp 65001 >nul
cd /d "%~dp0"
python local_story_server.py --host 127.0.0.1 --port 4173
pause
