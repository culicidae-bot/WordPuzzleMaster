var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WebSocketServer } from 'ws';
import { gameService } from './game-service';
export function setupWebSockets(server) {
    const wss = new WebSocketServer({ server });
    const rooms = new Map();
    wss.on('connection', (ws) => {
        console.log('WebSocket connection established');
        let currentRoomCode = null;
        let playerId = Math.random().toString(36).substring(2, 10);
        ws.on('message', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const message = JSON.parse(data.toString());
                switch (message.type) {
                    case 'join_room': {
                        if (!message.roomCode || !message.username) {
                            sendError(ws, 'Missing roomCode or username');
                            return;
                        }
                        const roomCode = message.roomCode;
                        const username = message.username;
                        // Check if room exists in database
                        const room = yield gameService.getMultiplayerRoom(roomCode);
                        if (!room) {
                            sendError(ws, 'Room not found');
                            return;
                        }
                        // Create room in WebSocket if it doesn't exist
                        if (!rooms.has(roomCode)) {
                            rooms.set(roomCode, {
                                roomCode,
                                players: new Map()
                            });
                        }
                        const roomConnection = rooms.get(roomCode);
                        // Check if room is full
                        if (roomConnection.players.size >= room.maxPlayers) {
                            sendError(ws, 'Room is full');
                            return;
                        }
                        // Add player to room
                        roomConnection.players.set(playerId, {
                            ws,
                            userId: message.userId,
                            username,
                            progress: 0
                        });
                        // Save current room code
                        currentRoomCode = roomCode;
                        // Broadcast join message
                        broadcastToRoom(roomCode, {
                            type: 'player_joined',
                            username,
                            message: `${username} joined the room`
                        });
                        // Send room state to player
                        const players = Array.from(roomConnection.players.values()).map(player => ({
                            username: player.username,
                            progress: player.progress
                        }));
                        ws.send(JSON.stringify({
                            type: 'room_state',
                            roomCode,
                            players,
                            levelId: room.levelId
                        }));
                        console.log(`Player ${username} joined room ${roomCode}`);
                        break;
                    }
                    case 'leave_room': {
                        if (currentRoomCode) {
                            handlePlayerLeave(currentRoomCode, playerId);
                            currentRoomCode = null;
                        }
                        break;
                    }
                    case 'chat_message': {
                        if (!currentRoomCode || !message.message || !message.username) {
                            sendError(ws, 'Missing roomCode, message, or username');
                            return;
                        }
                        broadcastToRoom(currentRoomCode, {
                            type: 'chat_message',
                            username: message.username,
                            message: message.message
                        });
                        break;
                    }
                    case 'word_found': {
                        if (!currentRoomCode || !message.wordFound || !message.username) {
                            sendError(ws, 'Missing roomCode, wordFound, or username');
                            return;
                        }
                        broadcastToRoom(currentRoomCode, {
                            type: 'word_found',
                            username: message.username,
                            wordFound: message.wordFound
                        });
                        break;
                    }
                    case 'update_progress': {
                        if (!currentRoomCode || message.progress === undefined || !message.username) {
                            sendError(ws, 'Missing roomCode, progress, or username');
                            return;
                        }
                        // Update player progress
                        const roomConnection = rooms.get(currentRoomCode);
                        if (roomConnection) {
                            const player = roomConnection.players.get(playerId);
                            if (player) {
                                player.progress = message.progress;
                                // Broadcast progress update
                                broadcastToRoom(currentRoomCode, {
                                    type: 'progress_update',
                                    username: message.username,
                                    progress: message.progress
                                });
                                // Check if game is complete
                                if (message.progress >= 100) {
                                    broadcastToRoom(currentRoomCode, {
                                        type: 'game_complete',
                                        username: message.username,
                                        message: `${message.username} completed the puzzle!`
                                    });
                                    // Update room status in database
                                    const room = yield gameService.getMultiplayerRoom(currentRoomCode);
                                    if (room) {
                                        yield gameService.updateRoomStatus(room.id, 'completed');
                                    }
                                }
                            }
                        }
                        break;
                    }
                    case 'start_game': {
                        if (!currentRoomCode) {
                            sendError(ws, 'Missing roomCode');
                            return;
                        }
                        broadcastToRoom(currentRoomCode, {
                            type: 'game_starting',
                            message: 'The game is starting!'
                        });
                        // Update room status
                        const room = yield gameService.getMultiplayerRoom(currentRoomCode);
                        if (room) {
                            yield gameService.updateRoomStatus(room.id, 'playing');
                        }
                        break;
                    }
                }
            }
            catch (error) {
                console.error('Error processing WebSocket message:', error);
                sendError(ws, 'Invalid message format');
            }
        }));
        ws.on('close', () => {
            console.log('WebSocket connection closed');
            // Remove player from any room they were in
            if (currentRoomCode) {
                handlePlayerLeave(currentRoomCode, playerId);
            }
        });
        function handlePlayerLeave(roomCode, playerId) {
            const roomConnection = rooms.get(roomCode);
            if (roomConnection) {
                const player = roomConnection.players.get(playerId);
                if (player) {
                    // Remove player from room
                    roomConnection.players.delete(playerId);
                    // Broadcast leave message
                    broadcastToRoom(roomCode, {
                        type: 'player_left',
                        username: player.username,
                        message: `${player.username} left the room`
                    });
                    console.log(`Player ${player.username} left room ${roomCode}`);
                    // If room is empty, remove it
                    if (roomConnection.players.size === 0) {
                        rooms.delete(roomCode);
                        console.log(`Room ${roomCode} removed`);
                    }
                }
            }
        }
        function sendError(ws, message) {
            ws.send(JSON.stringify({
                type: 'error',
                message
            }));
        }
        function broadcastToRoom(roomCode, message) {
            const roomConnection = rooms.get(roomCode);
            if (roomConnection) {
                roomConnection.players.forEach(player => {
                    player.ws.send(JSON.stringify(message));
                });
            }
        }
    });
    console.log('WebSocket server initialized');
}
