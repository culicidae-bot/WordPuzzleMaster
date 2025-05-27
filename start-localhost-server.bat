@echo off
echo ===================================================
echo    BOGGLE BLITZ ONLINE - LOCAL SERVER LAUNCHER
echo ===================================================
echo.

:: Get the local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :found_ip
)
:found_ip
set IP=%IP:~1%

echo Starting Boggle Blitz Online server...
echo.
echo Local access URL: http://localhost:3000
echo.
echo Network access URL: http://%IP%:3000
echo (Share this URL with friends on the same network to play together)
echo.
echo ===================================================
echo.
echo Press Ctrl+C to stop the server when finished
echo.

:: Start the server
cd /d "%~dp0"
start "" http://localhost:3000
npm start