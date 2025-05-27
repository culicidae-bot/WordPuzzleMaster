# Boggle Blitz Online - Local Hosting Guide

This guide will help you set up and run Boggle Blitz Online on your local network, allowing you to play with friends on the same WiFi network.

## Quick Start

1. **Start the local server**:
   - Double-click the `start-localhost-server.bat` file
   - This will start the server and open the game in your browser

2. **Play on your computer**:
   - The game will automatically open at http://localhost:3000
   - You can also access the welcome page at http://localhost:3000/welcome

3. **Play with friends on the same network**:
   - Share your network URL (shown when you start the server)
   - Friends can access the game by entering this URL in their browser
   - Create a room and share the room code with your friends

## Detailed Instructions

### Starting the Server

1. **Using the batch file (recommended)**:
   - Navigate to the game directory
   - Double-click `start-localhost-server.bat`
   - The server will start and display your local network URL

2. **Using the command line**:
   - Open Command Prompt or PowerShell
   - Navigate to the game directory
   - Run `npm start`

### Finding Your Network URL

Your network URL is based on your computer's IP address on the local network. There are several ways to find it:

1. **From the welcome page**:
   - Go to http://localhost:3000/welcome
   - Your network URL will be displayed in the "Network Play" section

2. **Using the IP address tool**:
   - Double-click `get-ip-address.bat`
   - This will display your network URL

3. **From the server console**:
   - When you start the server, it will display your network URL in the console

### Playing with Friends

1. **Start the server** on your computer
2. **Share your network URL** with friends (e.g., http://192.168.1.5:3000)
3. **Create a game room** and note the room code
4. **Share the room code** with your friends
5. **Friends join the room** using the room code
6. **Start the game** when everyone has joined

## Troubleshooting

### Server Won't Start

- Make sure Node.js is installed correctly
- Check that no other application is using port 3000
- Try restarting your computer

### Friends Can't Connect

- Make sure everyone is on the same WiFi network
- Check if your firewall is blocking connections on port 3000
- Try using a different port by setting the PORT environment variable

### Game Lag or Disconnections

- Reduce the number of players (4-6 is optimal)
- Make sure your WiFi signal is strong
- Close other bandwidth-intensive applications

## Advanced Configuration

You can customize the server by setting environment variables:

- `PORT`: Change the port number (default: 3000)
- `HOST`: Change the host address (default: 0.0.0.0)

Example (in Command Prompt):
```
set PORT=8080
npm start
```

## Need Help?

If you encounter any issues, please check the main README.md file or contact support.