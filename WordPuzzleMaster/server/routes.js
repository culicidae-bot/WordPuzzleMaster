var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createServer } from "http";
import { storage } from "./storage";
import { setupWebSockets } from "./websocket";
import { z } from "zod";
import { insertUserSchema, // Import User type for settings
insertLeaderboardEntrySchema, insertUserLevelProgressSchema, insertMultiplayerRoomSchema } from "../shared/schema";
export function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const httpServer = createServer(app);
        // Enable WebSockets for multiplayer functionality
        setupWebSockets(httpServer);
        // User routes
        app.post("/api/users/register", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Registration request received:", req.body);
                const userData = insertUserSchema.parse(req.body);
                console.log("Parsed user data:", userData);
                const existingUser = yield storage.getUserByUsername(userData.username);
                if (existingUser) {
                    console.log("Username already taken:", userData.username);
                    return res.status(409).json({ message: "Username already taken" });
                }
                console.log("Creating new user:", userData.username);
                const user = yield storage.createUser(userData);
                console.log("User created successfully:", user);
                res.status(201).json({ id: user.id, username: user.username });
            }
            catch (error) {
                console.error("Registration error:", error);
                if (error instanceof Error) {
                    res.status(400).json({ message: `Invalid user data: ${error.message}` });
                }
                else {
                    res.status(400).json({ message: "Invalid user data" });
                }
            }
        }));
        app.post("/api/users/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = insertUserSchema.parse(req.body);
                // Explicitly cast to a type that includes password
                const user = (yield storage.getUserByUsername(username));
                if (!user || user.password !== password) {
                    return res.status(401).json({ message: "Invalid credentials" });
                }
                // In a real app, use proper authentication
                res.status(200).json({
                    id: user.id,
                    username: user.username,
                    coins: user.coins,
                    currentLevel: user.currentLevel,
                    hintsRemaining: user.hintsRemaining,
                    settings: user.settings
                });
            }
            catch (error) {
                res.status(400).json({ message: "Invalid login data" });
            }
        }));
        app.get("/api/users/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id);
            if (isNaN(userId)) {
                return res.status(400).json({ message: "Invalid user ID" });
            }
            const user = yield storage.getUser(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({
                id: user.id,
                username: user.username,
                coins: user.coins,
                currentLevel: user.currentLevel,
                hintsRemaining: user.hintsRemaining,
                settings: user.settings
            });
        }));
        app.patch("/api/users/:id/settings", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id);
            if (isNaN(userId)) {
                return res.status(400).json({ message: "Invalid user ID" });
            }
            const settingsSchema = z.object({
                musicEnabled: z.boolean().optional(),
                sfxEnabled: z.boolean().optional(),
                theme: z.string().optional(),
                difficulty: z.string().optional()
            });
            try {
                const settings = settingsSchema.parse(req.body);
                const user = yield storage.getUser(userId);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                // Type-safe way to merge settings
                const currentSettings = user.settings; // user.settings should be from SharedUser
                const newSettings = settings; // settings is from settingsSchema.parse(req.body)
                // Ensure updatedSettings conforms to the expected SharedUser['settings'] structure
                const updatedSettings = Object.assign(Object.assign({}, currentSettings), newSettings);
                // Create a properly typed partial user object
                const updateData = {
                    settings: updatedSettings
                };
                const updatedUser = yield storage.updateUser(userId, updateData);
                res.status(200).json({ settings: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.settings });
            }
            catch (error) {
                res.status(400).json({ message: "Invalid settings data" });
            }
        }));
        // Game level routes
        app.get("/api/levels", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const levels = yield storage.getAllGameLevels();
            res.status(200).json(levels);
        }));
        app.get("/api/levels/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const levelId = parseInt(req.params.id);
            if (isNaN(levelId)) {
                return res.status(400).json({ message: "Invalid level ID" });
            }
            const level = yield storage.getGameLevel(levelId);
            if (!level) {
                return res.status(404).json({ message: "Level not found" });
            }
            res.status(200).json(level);
        }));
        app.get("/api/daily-puzzle", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dailyPuzzle = yield storage.getDailyPuzzle();
            if (!dailyPuzzle) {
                return res.status(404).json({ message: "Daily puzzle not found" });
            }
            res.status(200).json(dailyPuzzle);
        }));
        // Level progress routes
        app.get("/api/users/:userId/progress/:levelId", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.userId);
            const levelId = parseInt(req.params.levelId);
            if (isNaN(userId) || isNaN(levelId)) {
                return res.status(400).json({ message: "Invalid user or level ID" });
            }
            const progress = yield storage.getUserLevelProgress(userId, levelId);
            if (!progress) {
                return res.status(404).json({ message: "Progress not found" });
            }
            res.status(200).json(progress);
        }));
        app.post("/api/users/:userId/progress", (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const userId = parseInt(req.params.userId);
            if (isNaN(userId)) {
                return res.status(400).json({ message: "Invalid user ID" });
            }
            try {
                // Ensure all required fields have values
                // Create a fully defined object with all required fields
                const progressData = {
                    userId: userId,
                    levelId: (_a = req.body.levelId) !== null && _a !== void 0 ? _a : 1,
                    completed: true,
                    stars: (_b = req.body.stars) !== null && _b !== void 0 ? _b : 1,
                    wordsFound: (_c = req.body.wordsFound) !== null && _c !== void 0 ? _c : [],
                    timeSpent: (_d = req.body.timeSpent) !== null && _d !== void 0 ? _d : 0,
                    hintsUsed: (_e = req.body.hintsUsed) !== null && _e !== void 0 ? _e : 0
                };
                const validatedData = insertUserLevelProgressSchema.parse(progressData);
                const progress = yield storage.saveUserLevelProgress(progressData);
                res.status(201).json(progress);
            }
            catch (error) {
                res.status(400).json({ message: "Invalid progress data" });
            }
        }));
        // Leaderboard routes
        app.get("/api/leaderboard", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const entries = yield storage.getLeaderboardEntries(limit);
            res.status(200).json(entries);
        }));
        app.get("/api/leaderboard/weekly", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const entries = yield storage.getWeeklyLeaderboard(limit);
            res.status(200).json(entries);
        }));
        app.get("/api/leaderboard/daily", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const entries = yield storage.getDailyLeaderboard(limit);
            res.status(200).json(entries);
        }));
        app.post("/api/leaderboard", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const entryData = insertLeaderboardEntrySchema.parse(req.body);
                const entry = yield storage.addLeaderboardEntry(entryData);
                res.status(201).json(entry);
            }
            catch (error) {
                res.status(400).json({ message: "Invalid leaderboard entry data" });
            }
        }));
        // Multiplayer room routes
        app.post("/api/rooms", (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const roomData = insertMultiplayerRoomSchema.parse(req.body);
                // Ensure maxPlayers has a value
                const roomWithDefaults = Object.assign(Object.assign({}, roomData), { maxPlayers: (_a = roomData.maxPlayers) !== null && _a !== void 0 ? _a : 4 });
                const room = yield storage.createRoom(roomWithDefaults);
                res.status(201).json(room);
            }
            catch (error) {
                res.status(400).json({ message: "Invalid room data" });
            }
        }));
        app.get("/api/rooms/:code", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const code = req.params.code;
            const room = yield storage.getRoomByCode(code);
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }
            res.status(200).json(room);
        }));
        app.patch("/api/rooms/:id/status", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const roomId = parseInt(req.params.id);
            if (isNaN(roomId)) {
                return res.status(400).json({ message: "Invalid room ID" });
            }
            const statusSchema = z.object({
                status: z.string()
            });
            try {
                const { status } = statusSchema.parse(req.body);
                const room = yield storage.updateRoomStatus(roomId, status);
                if (!room) {
                    return res.status(404).json({ message: "Room not found" });
                }
                res.status(200).json(room);
            }
            catch (error) {
                res.status(400).json({ message: "Invalid status data" });
            }
        }));
        return httpServer;
    });
}
