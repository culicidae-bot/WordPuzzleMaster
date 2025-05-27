var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { storage } from "./storage";
import { shuffle } from "../client/src/lib/utils";
export class GameService {
    /**
     * Retrieves a specific game level
     */
    getLevel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const level = yield storage.getGameLevel(id);
                return level || null;
            }
            catch (error) {
                console.error("Error fetching level:", error);
                return null;
            }
        });
    }
    /**
     * Retrieves all available game levels
     */
    getAllLevels() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield storage.getAllGameLevels();
            }
            catch (error) {
                console.error("Error fetching all levels:", error);
                return [];
            }
        });
    }
    /**
     * Retrieves the daily puzzle
     */
    getDailyPuzzle() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const puzzle = yield storage.getDailyPuzzle();
                return puzzle || null;
            }
            catch (error) {
                console.error("Error fetching daily puzzle:", error);
                return null;
            }
        });
    }
    /**
     * Calculates score based on level completion stats
     */
    calculateScore(stats, difficulty = "beginner") {
        // Base score for completing the level
        let score = 100;
        // Add points for each word found
        score += stats.wordsFound.length * 20;
        // Time bonus
        if (stats.timeSpent < 60) { // Less than 1 minute
            score += 100;
        }
        else if (stats.timeSpent < 120) { // Less than 2 minutes
            score += 50;
        }
        else if (stats.timeSpent < 300) { // Less than 5 minutes
            score += 25;
        }
        // Difficulty multiplier
        const difficultyMultiplier = difficulty === "mystic" ? 1.5 :
            difficulty === "normal" ? 1.2 :
                1.0;
        score = Math.round(score * difficultyMultiplier);
        // Penalty for using hints
        score -= stats.hintsUsed * 15;
        // Ensure minimum score
        return Math.max(10, score);
    }
    /**
     * Saves user progress for a level
     */
    saveLevelProgress(userId, levelId, stats) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get user to determine difficulty
                const user = yield storage.getUser(userId);
                if (!user)
                    return null;
                // Ensure user.settings is of expected type
                const settings = user.settings;
                const difficulty = (settings === null || settings === void 0 ? void 0 : settings.difficulty) || "beginner";
                // Calculate score and stars
                const score = this.calculateScore(stats, difficulty);
                const stars = this.calculateStars(stats);
                // Prepare progress data
                const progressData = {
                    userId,
                    levelId,
                    completed: true,
                    stars,
                    wordsFound: stats.wordsFound,
                    timeSpent: stats.timeSpent,
                    hintsUsed: stats.hintsUsed
                };
                // Save progress
                const progress = yield storage.saveUserLevelProgress(progressData);
                // Update user stats
                yield storage.updateUser(userId, {
                    coins: user.coins + score,
                    currentLevel: Math.max(user.currentLevel, levelId + 1),
                    hintsRemaining: user.hintsRemaining
                });
                // Add leaderboard entry
                yield storage.addLeaderboardEntry({
                    userId,
                    score,
                    level: levelId
                });
                return progress;
            }
            catch (error) {
                console.error("Error saving level progress:", error);
                return null;
            }
        });
    }
    /**
     * Calculates stars based on performance (0-3)
     */
    calculateStars(stats) {
        let stars = 3;
        // Deduct star for each hint used (up to 2)
        stars -= Math.min(2, stats.hintsUsed);
        // Deduct star for slow completion
        if (stats.timeSpent > 300) { // Over 5 minutes
            stars--;
        }
        return Math.max(1, stars); // Minimum 1 star
    }
    /**
     * Creates a new word puzzle level
     */
    createLevel(id, name, words, gridSize = { rows: 5, cols: 5 }) {
        // Initialize empty grid
        const grid = Array(gridSize.rows)
            .fill(0)
            .map((_, rowIndex) => Array(gridSize.cols)
            .fill(0)
            .map((_, colIndex) => ({
            row: rowIndex,
            col: colIndex,
            letter: "",
            filled: false
        })));
        // Create word objects and place them in the grid
        const wordObjects = [];
        // Sort words by length (longest first)
        const sortedWords = [...words].sort((a, b) => b.length - a.length);
        // Place words in the grid
        for (let i = 0; i < sortedWords.length; i++) {
            const word = sortedWords[i];
            const direction = i % 2 === 0 ? "across" : "down";
            // Find a suitable position for the word
            const position = this.findWordPosition(grid, word, direction, gridSize);
            if (position) {
                // Place the word in the grid
                this.placeWordInGrid(grid, word, position, direction);
                // Add to word objects
                wordObjects.push({
                    text: word,
                    startPosition: position,
                    direction
                });
            }
        }
        // Collect all unique letters used in words
        const allLetters = new Set();
        words.forEach(word => {
            word.split('').forEach(letter => {
                allLetters.add(letter);
            });
        });
        // Convert to array and shuffle
        const availableLetters = shuffle(Array.from(allLetters));
        return {
            id,
            name,
            gridSize,
            grid,
            words: wordObjects,
            availableLetters
        };
    }
    /**
     * Find a suitable position for a word in the grid
     */
    findWordPosition(grid, word, direction, gridSize) {
        // For each potential starting position
        for (let row = 0; row < gridSize.rows; row++) {
            for (let col = 0; col < gridSize.cols; col++) {
                if (this.canPlaceWord(grid, word, { row, col }, direction, gridSize)) {
                    return { row, col };
                }
            }
        }
        return null; // No suitable position found
    }
    /**
     * Check if a word can be placed at a given position and direction
     */
    canPlaceWord(grid, word, position, direction, gridSize) {
        const { row, col } = position;
        // Check if word fits within the grid
        if (direction === "across" && col + word.length > gridSize.cols) {
            return false;
        }
        if (direction === "down" && row + word.length > gridSize.rows) {
            return false;
        }
        // Check if the position is available for each letter
        for (let i = 0; i < word.length; i++) {
            const currentRow = direction === "across" ? row : row + i;
            const currentCol = direction === "across" ? col + i : col;
            // Get the current cell
            const cell = grid[currentRow][currentCol];
            // Check if cell is already filled with a different letter
            if (cell.letter !== "" && cell.letter !== word[i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Place a word in the grid
     */
    placeWordInGrid(grid, word, position, direction) {
        const { row, col } = position;
        for (let i = 0; i < word.length; i++) {
            const currentRow = direction === "across" ? row : row + i;
            const currentCol = direction === "across" ? col + i : col;
            grid[currentRow][currentCol].letter = word[i];
        }
    }
    /**
     * Create a multiplayer room
     */
    createMultiplayerRoom(hostId_1, levelId_1) {
        return __awaiter(this, arguments, void 0, function* (hostId, levelId, maxPlayers = 4) {
            try {
                // Verify user exists
                const host = yield storage.getUser(hostId);
                if (!host)
                    return null;
                // Verify level exists
                const level = yield storage.getGameLevel(levelId);
                if (!level)
                    return null;
                // Create room
                const room = yield storage.createRoom({
                    hostId,
                    levelId,
                    maxPlayers: Math.min(8, Math.max(2, maxPlayers)) // Between 2 and 8 players
                });
                return room;
            }
            catch (error) {
                console.error("Error creating multiplayer room:", error);
                return null;
            }
        });
    }
    /**
     * Get a multiplayer room by code
     */
    getMultiplayerRoom(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const room = yield storage.getRoomByCode(code);
                return room || null;
            }
            catch (error) {
                console.error("Error getting multiplayer room:", error);
                return null;
            }
        });
    }
    /**
     * Update room status
     */
    updateRoomStatus(roomId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const room = yield storage.updateRoomStatus(roomId, status);
                return room || null;
            }
            catch (error) {
                console.error("Error updating room status:", error);
                return null;
            }
        });
    }
}
export const gameService = new GameService();
