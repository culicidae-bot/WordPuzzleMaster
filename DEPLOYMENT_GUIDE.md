# Boggle Blitz Online - Deployment Guide

This guide will help you deploy your Boggle Blitz Online game to various hosting platforms so users can play without any setup or debugging required.

## Preparing for Deployment

Before deploying to any platform, run the preparation script:

```bash
node deploy.js
```

This script will:
1. Create an optimized version of your game in the `dist` directory
2. Generate production-ready server code
3. Create necessary configuration files for various hosting platforms

## Deployment Options

### Option 1: Heroku (Recommended for Full-Stack Apps)

Heroku is ideal for hosting both the frontend and backend of your game.

1. **Install the Heroku CLI**:
   - Download and install from [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Deploy to Heroku**:
   ```bash
   npm run deploy:heroku
   ```

4. **Or deploy manually**:
   ```bash
   cd dist
   git init
   git add .
   git commit -m "Initial deployment"
   heroku create boggle-blitz-online
   git push heroku master
   ```

5. **Open your deployed app**:
   ```bash
   heroku open
   ```

### Option 2: Render

Render is a modern cloud platform that's easy to use and offers a generous free tier.

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Select the repository with your game
   - Configure as follows:
     - Name: boggle-blitz-online
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Select the free plan

3. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically deploy your app

### Option 3: Railway

Railway is a modern platform for deploying full-stack applications.

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Create a new project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account and select your repository

3. **Configure the deployment**:
   - Environment: Node.js
   - Start Command: `npm start`

4. **Deploy**:
   - Railway will automatically deploy your app
   - Click on the deployment to see your app URL

### Option 4: Glitch

Glitch is a simple platform for building and deploying web apps.

1. **Create a Glitch account** at [glitch.com](https://glitch.com)

2. **Create a new project**:
   - Click "New Project"
   - Select "Import from GitHub"
   - Enter your GitHub repository URL

3. **Configure the project**:
   - Glitch will automatically detect Node.js
   - It will use the start script from your package.json

4. **Your app is live**:
   - Glitch automatically deploys your app
   - The URL will be something like `https://your-project-name.glitch.me`

## Custom Domain Setup

After deploying to any platform, you can add a custom domain:

1. **Purchase a domain** from a registrar like Namecheap, GoDaddy, or Google Domains

2. **Configure DNS settings**:
   - Add a CNAME record pointing to your deployed app
   - Or follow the specific instructions from your hosting platform

3. **Configure SSL**:
   - Most platforms handle SSL certificates automatically
   - If not, you can use Let's Encrypt for free SSL certificates

## Troubleshooting Deployment Issues

### Socket.IO Connection Problems

If users are having trouble connecting via Socket.IO:

1. Check that your Socket.IO client is configured correctly:
   ```javascript
   const socket = io({
     transports: ['websocket', 'polling'],
     reconnection: true,
     reconnectionAttempts: 5
   });
   ```

2. Ensure your hosting platform supports WebSockets

### Game Performance Issues

If the game is slow or unresponsive:

1. Consider upgrading to a paid tier on your hosting platform
2. Optimize your server code to handle more concurrent users
3. Implement server-side caching for frequently accessed data

## Monitoring Your Deployed Game

Most hosting platforms provide basic monitoring. For more advanced monitoring:

1. Add logging with a service like Loggly or Papertrail
2. Set up uptime monitoring with UptimeRobot or Pingdom
3. Implement error tracking with Sentry or Rollbar

## Need More Help?

If you encounter issues with deployment, consult the documentation for your chosen hosting platform or reach out to their support team.