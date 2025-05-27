@echo off
color 0B
title Boggle Blitz Online - Web Deployment Launcher

:menu
cls
echo ===================================================
echo    BOGGLE BLITZ ONLINE - WEB DEPLOYMENT LAUNCHER
echo ===================================================
echo.
echo Choose a deployment option:
echo.
echo  1. Deploy to Heroku (Recommended)
echo  2. Deploy to Render
echo  3. Prepare for Manual Deployment
echo  4. View Deployment Guide
echo  5. Exit
echo.
echo ===================================================
echo.

set /p choice=Enter your choice (1-5): 

if "%choice%"=="1" goto deploy_heroku
if "%choice%"=="2" goto deploy_render
if "%choice%"=="3" goto manual_deploy
if "%choice%"=="4" goto view_guide
if "%choice%"=="5" goto exit
goto menu

:deploy_heroku
cls
echo Launching Heroku deployment script...
call deploy-to-heroku.bat
goto menu

:deploy_render
cls
echo Launching Render deployment script...
call deploy-to-render.bat
goto menu

:manual_deploy
cls
echo Preparing files for manual deployment...
node deploy.js
echo.
echo Files prepared in the 'dist' directory.
echo You can now manually deploy these files to any hosting platform.
echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:view_guide
cls
type DEPLOYMENT_GUIDE.md | more
echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:exit
exit