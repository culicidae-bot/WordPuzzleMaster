@echo off
color 0B
title Boggle Blitz Online - Game Launcher

:menu
cls
echo ===================================================
echo         BOGGLE BLITZ ONLINE - GAME LAUNCHER
echo ===================================================
echo.
echo  1. Start Server and Play (Recommended)
echo  2. View Network Play Information
echo  3. Open Game in Browser
echo  4. View Local Hosting Guide
echo  5. Exit
echo.
echo ===================================================
echo.

set /p choice=Enter your choice (1-5): 

if "%choice%"=="1" goto start_server
if "%choice%"=="2" goto show_ip
if "%choice%"=="3" goto open_browser
if "%choice%"=="4" goto show_guide
if "%choice%"=="5" goto exit
goto menu

:start_server
cls
echo Starting Boggle Blitz Online server...
echo.
echo The game will open in your default browser.
echo.
echo Press Ctrl+C to stop the server when finished.
echo.
start "" http://localhost:3000/welcome
cd /d "%~dp0"
npm start
goto exit

:show_ip
cls
echo ===================================================
echo    BOGGLE BLITZ ONLINE - NETWORK PLAY INFO
echo ===================================================
echo.

:: Get the local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :found_ip
)
:found_ip
set IP=%IP:~1%

echo Your Boggle Blitz server is available at:
echo.
echo http://%IP%:3000
echo.
echo Share this URL with friends on the same network to play together!
echo.
echo ===================================================
echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:open_browser
start "" http://localhost:3000/welcome
echo Opening game in browser...
timeout /t 2 > nul
goto menu

:show_guide
cls
type LOCAL_HOSTING.md | more
echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:exit
exit