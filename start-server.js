// Simple script to start the server
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Copy the public directory to dist if it doesn't exist
const distDir = join(__dirname, 'dist');
const publicDir = join(__dirname, 'public');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Copy public files to dist
fs.readdirSync(publicDir).forEach(file => {
    const srcPath = join(publicDir, file);
    const destPath = join(distDir, file);
    
    if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, join(distDir, file));
        console.log(`Copied ${file} to dist directory`);
    }
});

// Copy words.json to dist if it exists
const wordsPath = join(__dirname, 'words.json');
if (fs.existsSync(wordsPath)) {
    fs.copyFileSync(wordsPath, join(distDir, 'words.json'));
    console.log('Copied words.json to dist directory');
}

// Start the server
console.log('Starting server...');
exec('node src/server.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    console.log(`Server output: ${stdout}`);
});