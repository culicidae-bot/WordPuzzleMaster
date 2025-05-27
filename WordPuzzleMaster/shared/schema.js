// Only types/interfaces and Zod schemas that do NOT use drizzle/db code
import { z } from 'zod';
// Add any other pure types/interfaces here
export const insertUserSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must be at most 20 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});
// Add the missing schema exports that are referenced in routes.ts
export const insertLeaderboardEntrySchema = z.object({
    userId: z.number(),
    score: z.number(),
    level: z.number()
});
export const insertUserLevelProgressSchema = z.object({
    userId: z.number(),
    levelId: z.number(),
    completed: z.boolean(),
    stars: z.number(),
    wordsFound: z.array(z.string()),
    timeSpent: z.number(),
    hintsUsed: z.number()
});
export const insertMultiplayerRoomSchema = z.object({
    hostId: z.number(),
    levelId: z.number(),
    maxPlayers: z.number().optional().default(4)
});
