@echo off
color 0B
title Boggle Blitz Online - Heroku Deployment

echo ===================================================
echo    BOGGLE BLITZ ONLINE - HEROKU DEPLOYMENT
echo ===================================================
echo.
echo This script will deploy your game to Heroku.
echo Make sure you have:
echo  1. Installed the Heroku CLI
echo  2. Logged in to Heroku (run 'heroku login')
echo  3. Git installed on your computer
echo.
echo ===================================================
echo.

pause

echo.
echo Step 1: Preparing files for deployment...
echo.

node deploy.js

echo.
echo Step 2: Initializing Git repository in the dist directory...
echo.

cd dist
git init
git add .
git commit -m "Deploy to Heroku"

echo.
echo Step 3: Creating a new Heroku app...
echo.

heroku create boggle-blitz-online-%RANDOM%

echo.
echo Step 4: Deploying to Heroku...
echo.

git push heroku master

echo.
echo Step 5: Opening the deployed app...
echo.

heroku open

echo.
echo ===================================================
echo Deployment complete! Your game is now live on Heroku.
echo ===================================================
echo.

pause