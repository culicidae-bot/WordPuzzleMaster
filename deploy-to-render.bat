@echo off
color 0B
title Boggle Blitz Online - Render Deployment

echo ===================================================
echo    BOGGLE BLITZ ONLINE - RENDER DEPLOYMENT
echo ===================================================
echo.
echo This script will prepare your game for deployment to Render.
echo After running this script, you'll need to:
echo  1. Create a Render account at render.com
echo  2. Create a new Web Service
echo  3. Upload the files from the dist directory
echo.
echo ===================================================
echo.

pause

echo.
echo Step 1: Preparing files for deployment...
echo.

node deploy.js

echo.
echo Step 2: Creating a ZIP file of the dist directory...
echo.

powershell Compress-Archive -Path dist\* -DestinationPath boggle-blitz-render-deploy.zip -Force

echo.
echo ===================================================
echo Preparation complete!
echo.
echo Your deployment package is ready: boggle-blitz-render-deploy.zip
echo.
echo Next steps:
echo 1. Go to render.com and create an account if you don't have one
echo 2. Create a new Web Service
echo 3. Upload the ZIP file or connect your GitHub repository
echo 4. Configure as follows:
echo    - Environment: Node
echo    - Build Command: npm install
echo    - Start Command: npm start
echo ===================================================
echo.

start https://dashboard.render.com/web/new

pause