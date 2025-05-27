var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { users, leaderboardEntries, multiplayerRooms, userLevelProgress } from "./db/schema"; // Corrected path for DB table schemas
import { db } from "./db";
import { eq, desc, and, gte } from "drizzle-orm";
export class MemStorage {
    constructor() {
        this.users = new Map();
        this.leaderboard = new Map();
        this.rooms = new Map();
        this.progress = new Map();
        this.gameLevels = new Map();
        this.userId = 1;
        this.leaderboardId = 1;
        this.roomId = 1;
        this.progressId = 1;
        // Initialize with sample game levels
        this.initializeSampleLevels();
    }
    // User operations
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.users.get(id);
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return Array.from(this.users.values()).find((user) => user.username === username);
        });
    }
    createUser(insertUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.userId++;
            const user = Object.assign(Object.assign({}, insertUser), { id, coins: 500, currentLevel: 1, hintsRemaining: 3, settings: {
                    musicEnabled: true,
                    sfxEnabled: true,
                    theme: "magical",
                    difficulty: "beginner"
                } });
            this.users.set(id, user);
            return user;
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser(id);
            if (!user)
                return undefined;
            const updatedUser = Object.assign(Object.assign({}, user), data);
            this.users.set(id, updatedUser);
            return updatedUser;
        });
    }
    // Leaderboard operations
    getLeaderboardEntries() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            return Array.from(this.leaderboard.values())
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);
        });
    }
    getWeeklyLeaderboard() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return Array.from(this.leaderboard.values())
                .filter(entry => new Date(entry.timestamp) >= oneWeekAgo)
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);
        });
    }
    getDailyLeaderboard() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return Array.from(this.leaderboard.values())
                .filter(entry => new Date(entry.timestamp) >= today)
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);
        });
    }
    addLeaderboardEntry(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.leaderboardId++;
            const newEntry = Object.assign(Object.assign({}, entry), { id, timestamp: new Date() });
            this.leaderboard.set(id, newEntry);
            return newEntry;
        });
    }
    // Multiplayer room operations
    createRoom(roomData) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.roomId++;
            const code = this.generateRoomCode();
            const room = Object.assign(Object.assign({}, roomData), { id,
                code, status: "waiting", createdAt: new Date() });
            this.rooms.set(id, room);
            return room;
        });
    }
    getRoomByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return Array.from(this.rooms.values()).find(room => room.code === code);
        });
    }
    updateRoomStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = this.rooms.get(id);
            if (!room)
                return undefined;
            const updatedRoom = Object.assign(Object.assign({}, room), { status });
            this.rooms.set(id, updatedRoom);
            return updatedRoom;
        });
    }
    // Level progress operations
    getUserLevelProgress(userId, levelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `${userId}-${levelId}`;
            return this.progress.get(key);
        });
    }
    saveUserLevelProgress(progressData) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.progressId++;
            const key = `${progressData.userId}-${progressData.levelId}`;
            // Ensure all required fields have values
            const progress = {
                id,
                userId: progressData.userId,
                levelId: progressData.levelId,
                completed: progressData.completed || true,
                stars: progressData.stars || 1,
                wordsFound: progressData.wordsFound || [],
                timeSpent: progressData.timeSpent || 0,
                hintsUsed: progressData.hintsUsed || 0
            };
            this.progress.set(key, progress);
            return progress;
        });
    }
    // Game level operations
    getGameLevel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.gameLevels.get(id);
        });
    }
    getAllGameLevels() {
        return __awaiter(this, void 0, void 0, function* () {
            return Array.from(this.gameLevels.values());
        });
    }
    getDailyPuzzle() {
        return __awaiter(this, void 0, void 0, function* () {
            // In a real implementation, this would rotate daily
            return this.dailyPuzzle;
        });
    }
    // Helper methods
    generateRoomCode() {
        const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excluded confusing chars
        let code = "";
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
        return code;
    }
    initializeSampleLevels() {
        // Sample level 1 - "PARK"
        const level1 = {
            id: 1,
            name: "Forest Park",
            gridSize: { rows: 5, cols: 5 },
            grid: Array(5).fill(0).map(() => Array(5).fill(0).map(() => ({
                row: 0,
                col: 0,
                letter: "",
                filled: false
            }))),
            words: [
                {
                    text: "PARK",
                    startPosition: { row: 1, col: 0 },
                    direction: "across"
                },
                {
                    text: "SPARK",
                    startPosition: { row: 0, col: 2 },
                    direction: "down"
                }
            ],
            availableLetters: ["P", "A", "R", "K", "S"]
        };
        // Fill grid based on words
        level1.words.forEach((word) => {
            const { row, col } = word.startPosition;
            for (let i = 0; i < word.text.length; i++) {
                const letter = word.text[i];
                if (word.direction === "across") {
                    level1.grid[row][col + i] = {
                        row,
                        col: col + i,
                        letter,
                        filled: false
                    };
                }
                else {
                    level1.grid[row + i][col] = {
                        row: row + i,
                        col,
                        letter,
                        filled: false
                    };
                }
            }
        });
        this.gameLevels.set(level1.id, level1);
        // Sample level 2
        const level2 = {
            id: 2,
            name: "Mystic Mountain",
            gridSize: { rows: 5, cols: 5 },
            grid: Array(5).fill(0).map(() => Array(5).fill(0).map(() => ({
                row: 0,
                col: 0,
                letter: "",
                filled: false
            }))),
            words: [
                {
                    text: "MOUNT",
                    startPosition: { row: 0, col: 0 },
                    direction: "down"
                },
                {
                    text: "MAGIC",
                    startPosition: { row: 2, col: 0 },
                    direction: "across"
                }
            ],
            availableLetters: ["M", "O", "U", "N", "T", "A", "G", "I", "C"]
        };
        // Fill grid based on words
        level2.words.forEach((word) => {
            const { row, col } = word.startPosition;
            for (let i = 0; i < word.text.length; i++) {
                const letter = word.text[i];
                if (word.direction === "across") {
                    level2.grid[row][col + i] = {
                        row,
                        col: col + i,
                        letter,
                        filled: false
                    };
                }
                else {
                    level2.grid[row + i][col] = {
                        row: row + i,
                        col,
                        letter,
                        filled: false
                    };
                }
            }
        });
        this.gameLevels.set(level2.id, level2);
        // Set daily puzzle (could rotate daily in a real implementation)
        this.dailyPuzzle = {
            id: 999,
            name: "Daily Challenge",
            gridSize: { rows: 6, cols: 6 },
            grid: Array(6).fill(0).map(() => Array(6).fill(0).map(() => ({
                row: 0,
                col: 0,
                letter: "",
                filled: false
            }))),
            words: [
                {
                    text: "MYSTIC",
                    startPosition: { row: 0, col: 0 },
                    direction: "across"
                },
                {
                    text: "REALM",
                    startPosition: { row: 0, col: 0 },
                    direction: "down"
                },
                {
                    text: "SPELL",
                    startPosition: { row: 2, col: 1 },
                    direction: "across"
                }
            ],
            availableLetters: ["M", "Y", "S", "T", "I", "C", "R", "E", "A", "L", "P"]
        };
        // Fill grid based on words
        this.dailyPuzzle.words.forEach((word) => {
            const { row, col } = word.startPosition;
            for (let i = 0; i < word.text.length; i++) {
                const letter = word.text[i];
                if (word.direction === "across") {
                    this.dailyPuzzle.grid[row][col + i] = {
                        row,
                        col: col + i,
                        letter,
                        filled: false,
                    };
                }
                else {
                    this.dailyPuzzle.grid[row + i][col] = {
                        row: row + i,
                        col,
                        letter,
                        filled: false,
                    };
                }
            }
        });
    }
}
// Ensure only one `DatabaseStorage` class is defined
export class DatabaseStorage {
    constructor() {
        this.gameLevels = new Map();
        this.initializeSampleLevels();
    }
    // User operations
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [userFromDb] = yield db.select().from(users).where(eq(users.id, id));
            if (!userFromDb)
                return undefined;
            return Object.assign(Object.assign({}, userFromDb), { settings: userFromDb.settings });
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const [userFromDb] = yield db.select().from(users).where(eq(users.username, username));
            if (!userFromDb)
                return undefined;
            return Object.assign(Object.assign({}, userFromDb), { settings: userFromDb.settings });
        });
    }
    createUser(insertUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const [createdUser] = yield db
                .insert(users)
                .values({
                username: insertUser.username,
                password: insertUser.password, // Ensure password is provided as per schema
                coins: 500,
                currentLevel: 1,
                hintsRemaining: 3,
                settings: {
                    musicEnabled: true,
                    sfxEnabled: true,
                    theme: "magical",
                    difficulty: "beginner"
                }
            })
                .returning();
            return Object.assign(Object.assign({}, createdUser), { settings: createdUser.settings });
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updatedUserFromDb] = yield db
                .update(users)
                .set(data) // `data` might have settings, which is fine if Partial<User>
                .where(eq(users.id, id))
                .returning();
            if (!updatedUserFromDb)
                return undefined;
            return Object.assign(Object.assign({}, updatedUserFromDb), { settings: updatedUserFromDb.settings });
        });
    }
    // Leaderboard operations
    getLeaderboardEntries() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            return yield db
                .select()
                .from(leaderboardEntries)
                .orderBy(desc(leaderboardEntries.score))
                .limit(limit);
        });
    }
    getWeeklyLeaderboard() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return yield db
                .select()
                .from(leaderboardEntries)
                .where(gte(leaderboardEntries.timestamp, oneWeekAgo))
                .orderBy(desc(leaderboardEntries.score))
                .limit(limit);
        });
    }
    getDailyLeaderboard() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return yield db
                .select()
                .from(leaderboardEntries)
                .where(gte(leaderboardEntries.timestamp, today))
                .orderBy(desc(leaderboardEntries.score))
                .limit(limit);
        });
    }
    addLeaderboardEntry(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newEntry] = yield db
                .insert(leaderboardEntries)
                .values(entry)
                .returning();
            return newEntry;
        });
    }
    // Multiplayer room operations
    createRoom(roomData) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = this.generateRoomCode();
            const [room] = yield db
                .insert(multiplayerRooms)
                .values(Object.assign(Object.assign({}, roomData), { code, status: "waiting" }))
                .returning();
            return room;
        });
    }
    getRoomByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const [room] = yield db
                .select()
                .from(multiplayerRooms)
                .where(eq(multiplayerRooms.code, code));
            return room;
        });
    }
    updateRoomStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const [room] = yield db
                .update(multiplayerRooms)
                .set({ status })
                .where(eq(multiplayerRooms.id, id))
                .returning();
            return room;
        });
    }
    // Level progress operations
    getUserLevelProgress(userId, levelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [progressFromDb] = yield db
                .select()
                .from(userLevelProgress)
                .where(and(eq(userLevelProgress.userId, userId), eq(userLevelProgress.levelId, levelId)));
            if (!progressFromDb)
                return undefined;
            return Object.assign(Object.assign({}, progressFromDb), { wordsFound: progressFromDb.wordsFound });
        });
    }
    saveUserLevelProgress(progressData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if progress already exists
            const existingProgress = yield this.getUserLevelProgress(progressData.userId, progressData.levelId);
            if (existingProgress) {
                // Update existing progress
                const [updatedFromDb] = yield db
                    .update(userLevelProgress)
                    .set(progressData) // progressData should align with update schema
                    .where(eq(userLevelProgress.id, existingProgress.id))
                    .returning();
                return Object.assign(Object.assign({}, updatedFromDb), { wordsFound: updatedFromDb.wordsFound });
            }
            else {
                // Create new progress
                const [newProgressFromDb] = yield db
                    .insert(userLevelProgress)
                    .values(progressData) // progressData should align with insert schema
                    .returning();
                return Object.assign(Object.assign({}, newProgressFromDb), { wordsFound: newProgressFromDb.wordsFound });
            }
        });
    }
    // Game level operations (still in-memory since they're not in the database)
    getGameLevel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.gameLevels.get(id);
        });
    }
    getAllGameLevels() {
        return __awaiter(this, void 0, void 0, function* () {
            return Array.from(this.gameLevels.values());
        });
    }
    getDailyPuzzle() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dailyPuzzle;
        });
    }
    // Helper methods
    generateRoomCode() {
        const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excluded confusing chars
        let code = "";
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
        return code;
    }
    initializeSampleLevels() {
        // Sample level 1 - "PARK"
        const level1 = {
            id: 1,
            name: "Forest Park",
            gridSize: { rows: 5, cols: 5 },
            grid: Array(5).fill(0).map(() => Array(5).fill(0).map(() => ({
                row: 0,
                col: 0,
                letter: "",
                filled: false
            }))),
            words: [
                {
                    text: "PARK",
                    startPosition: { row: 1, col: 0 },
                    direction: "across"
                },
                {
                    text: "SPARK",
                    startPosition: { row: 0, col: 2 },
                    direction: "down"
                }
            ],
            availableLetters: ["P", "A", "R", "K", "S"]
        };
        // Fill grid based on words
        level1.words.forEach((word) => {
            const { row, col } = word.startPosition;
            for (let i = 0; i < word.text.length; i++) {
                const letter = word.text[i];
                if (word.direction === "across") {
                    level1.grid[row][col + i] = {
                        row,
                        col: col + i,
                        letter,
                        filled: false
                    };
                }
                else {
                    level1.grid[row + i][col] = {
                        row: row + i,
                        col,
                        letter,
                        filled: false
                    };
                }
            }
        });
        this.gameLevels.set(level1.id, level1);
        // Sample level 2
        const level2 = {
            id: 2,
            name: "Mystic Mountain",
            gridSize: { rows: 5, cols: 5 },
            grid: Array(5).fill(0).map(() => Array(5).fill(0).map(() => ({
                row: 0,
                col: 0,
                letter: "",
                filled: false
            }))),
            words: [
                {
                    text: "MOUNT",
                    startPosition: { row: 0, col: 0 },
                    direction: "down"
                },
                {
                    text: "MAGIC",
                    startPosition: { row: 2, col: 0 },
                    direction: "across"
                }
            ],
            availableLetters: ["M", "O", "U", "N", "T", "A", "G", "I", "C"]
        };
        // Fill grid based on words
        level2.words.forEach((word) => {
            const { row, col } = word.startPosition;
            for (let i = 0; i < word.text.length; i++) {
                const letter = word.text[i];
                if (word.direction === "across") {
                    level2.grid[row][col + i] = {
                        row,
                        col: col + i,
                        letter,
                        filled: false
                    };
                }
                else {
                    level2.grid[row + i][col] = {
                        row: row + i,
                        col,
                        letter,
                        filled: false
                    };
                }
            }
        });
        this.gameLevels.set(level2.id, level2);
        // Set daily puzzle (could rotate daily in a real implementation)
        this.dailyPuzzle = {
            id: 999,
            name: "Daily Challenge",
            gridSize: { rows: 6, cols: 6 },
            grid: Array(6).fill(0).map(() => Array(6).fill(0).map(() => ({
                row: 0,
                col: 0,
                letter: "",
                filled: false
            }))),
            words: [
                {
                    text: "MYSTIC",
                    startPosition: { row: 0, col: 0 },
                    direction: "across"
                },
                {
                    text: "REALM",
                    startPosition: { row: 0, col: 0 },
                    direction: "down"
                },
                {
                    text: "SPELL",
                    startPosition: { row: 2, col: 1 },
                    direction: "across"
                }
            ],
            availableLetters: ["M", "Y", "S", "T", "I", "C", "R", "E", "A", "L", "P"]
        };
        // Fill grid based on words
        this.dailyPuzzle.words.forEach((word) => {
            const { row, col } = word.startPosition;
            for (let i = 0; i < word.text.length; i++) {
                const letter = word.text[i];
                if (word.direction === "across") {
                    this.dailyPuzzle.grid[row][col + i] = {
                        row,
                        col: col + i,
                        letter,
                        filled: false,
                    };
                }
                else {
                    this.dailyPuzzle.grid[row + i][col] = {
                        row: row + i,
                        col,
                        letter,
                        filled: false,
                    };
                }
            }
        });
    }
}
// Replace MemStorage with DatabaseStorage for the application
export const storage = new DatabaseStorage();
