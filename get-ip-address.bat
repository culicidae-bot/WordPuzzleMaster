@echo off
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
echo Press any key to close this window...
pause > nul