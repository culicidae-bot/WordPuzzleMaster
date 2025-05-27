// Deployment script for Boggle Blitz Online
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a dist directory if it doesn't exist
const distDir = join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Copy all files from public to dist
console.log('Copying public files to dist...');
const publicDir = join(__dirname, 'public');
fs.readdirSync(publicDir).forEach(file => {
    const srcPath = join(publicDir, file);
    const destPath = join(distDir, file);
    
    if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file} to dist directory`);
    }
});

// Copy words.json to dist
const wordsPath = join(__dirname, 'words.json');
if (fs.existsSync(wordsPath)) {
    fs.copyFileSync(wordsPath, join(distDir, 'words.json'));
    console.log('Copied words.json to dist directory');
}

// Create a simple server.js file for production
const serverContent = `
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load dictionary
const dictionary = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, 'words.json'), 'utf8')));

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(__dirname));

// Game state
const rooms = {};
const BOARD_SIZE = 4;
const ROUND_TIME = 90; // seconds

// Helper: Generate random Boggle board
function generateBoard(size = BOARD_SIZE) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const board = [];
    for (let i = 0; i < size * size; i++) {
        board.push(letters[Math.floor(Math.random() * letters.length)]);
    }
    return board;
}

// Helper: Validate word (exists in dictionary and can be formed on board)
function isValidWord(word, board, size) {
    word = word.toUpperCase();
    if (!dictionary.has(word) || word.length < 3)
        return false;
    
    // Board search (DFS)
    function dfs(x, y, idx, visited) {
        if (idx === word.length)
            return true;
        if (x < 0 || y < 0 || x >= size || y >= size ||
            visited.has(\`\${x},\${y}\`) ||
            board[y * size + x] !== word[idx])
            return false;
        
        visited.add(\`\${x},\${y}\`);
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx !== 0 || dy !== 0) {
                    if (dfs(x + dx, y + dy, idx + 1, new Set(visited))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (dfs(x, y, 0, new Set()))
                return true;
        }
    }
    return false;
}

// Socket.IO logic
io.on('connection', (socket) => {
    let currentRoom = null;
    let nickname = null;
    
    socket.on('joinRoom', ({ roomId, name }) => {
        nickname = name;
        currentRoom = roomId;
        
        if (!rooms[roomId]) {
            rooms[roomId] = {
                players: {},
                board: generateBoard(),
                roundActive: false,
                words: {},
                host: socket.id,
                timer: null,
            };
        }
        
        rooms[roomId].players[socket.id] = { name, score: 0 };
        socket.join(roomId);
        
        io.to(roomId).emit('roomUpdate', {
            players: rooms[roomId].players,
            host: rooms[roomId].host,
        });
    });
    
    socket.on('startRound', () => {
        if (!currentRoom || rooms[currentRoom].host !== socket.id)
            return;
        
        const board = generateBoard();
        rooms[currentRoom].board = board;
        rooms[currentRoom].roundActive = true;
        rooms[currentRoom].words = {};
        
        io.to(currentRoom).emit('roundStarted', { board, time: ROUND_TIME });
        
        // Timer
        rooms[currentRoom].timer = setTimeout(() => {
            if (currentRoom && rooms[currentRoom]) {
                rooms[currentRoom].roundActive = false;
                
                // Calculate scores
                const scores = {};
                for (const [pid, words] of Object.entries(rooms[currentRoom].words)) {
                    let score = 0;
                    for (const w of words)
                        score += w.length; // Simple scoring
                    
                    rooms[currentRoom].players[pid].score += score;
                    scores[pid] = {
                        name: rooms[currentRoom].players[pid].name,
                        score: rooms[currentRoom].players[pid].score,
                        words
                    };
                }
                
                io.to(currentRoom).emit('roundEnded', { scores });
            }
        }, ROUND_TIME * 1000);
    });
    
    socket.on('submitWord', (word) => {
        if (!currentRoom || !rooms[currentRoom].roundActive)
            return;
        
        if (!rooms[currentRoom].words[socket.id])
            rooms[currentRoom].words[socket.id] = [];
        
        if (isValidWord(word, rooms[currentRoom].board, BOARD_SIZE) &&
            !rooms[currentRoom].words[socket.id].includes(word)) {
            rooms[currentRoom].words[socket.id].push(word);
            socket.emit('wordAccepted', word);
        }
        else {
            socket.emit('wordRejected', word);
        }
    });
    
    socket.on('disconnect', () => {
        if (currentRoom && rooms[currentRoom]) {
            delete rooms[currentRoom].players[socket.id];
            
            if (Object.keys(rooms[currentRoom].players).length === 0) {
                // Clean up empty room
                if (rooms[currentRoom].timer !== null) {
                    clearTimeout(rooms[currentRoom].timer);
                }
                delete rooms[currentRoom];
            }
            else {
                // If host left, assign new host
                if (rooms[currentRoom].host === socket.id) {
                    rooms[currentRoom].host = Object.keys(rooms[currentRoom].players)[0];
                }
                
                io.to(currentRoom).emit('roomUpdate', {
                    players: rooms[currentRoom].players,
                    host: rooms[currentRoom].host,
                });
            }
        }
    });
});

// Serve welcome page
app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing.html'));
});

// Fallback route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(\`Boggle Blitz Online server running on port \${PORT}\`);
});
`;

fs.writeFileSync(join(distDir, 'server.js'), serverContent);
console.log('Created optimized server.js for production');

// Create a simple package.json for production
const packageJson = {
    "name": "boggle-blitz-online",
    "version": "1.0.0",
    "description": "Multiplayer Boggle-style word game",
    "main": "server.js",
    "type": "module",
    "scripts": {
        "start": "node server.js"
    },
    "dependencies": {
        "express": "^4.18.2",
        "socket.io": "^4.7.2"
    },
    "engines": {
        "node": ">=14.0.0"
    }
};

fs.writeFileSync(join(distDir, 'package.json'), JSON.stringify(packageJson, null, 2));
console.log('Created optimized package.json for production');

// Create a Procfile for Heroku
fs.writeFileSync(join(distDir, 'Procfile'), 'web: npm start');
console.log('Created Procfile for Heroku deployment');

// Create a simple README for the deployed version
const readmeContent = `# Boggle Blitz Online

A multiplayer word game where players compete to find words in a grid of letters.

## How to Play

1. Enter your nickname
2. Create a room or join an existing one with a room code
3. Start the game when all players have joined
4. Find words in the grid by connecting adjacent letters
5. Score points based on the length of words you find

## Game Rules

- Words must be at least 3 letters long
- Letters must be adjacent (including diagonally)
- Each letter can only be used once per word
- The player with the highest score at the end wins!

Enjoy the game!
`;

fs.writeFileSync(join(distDir, 'README.md'), readmeContent);
console.log('Created README.md for the deployed version');

// Create a .gitignore file
fs.writeFileSync(join(distDir, '.gitignore'), 'node_modules\n.env\n.DS_Store\n');
console.log('Created .gitignore file');

console.log('\nDeployment preparation complete!');
console.log('\nTo deploy to a hosting service:');
console.log('1. Create a new repository on GitHub');
console.log('2. Push the contents of the dist directory to the repository');
console.log('3. Connect your repository to a hosting service like Heroku, Vercel, or Netlify');
console.log('4. Follow the hosting service\'s deployment instructions');