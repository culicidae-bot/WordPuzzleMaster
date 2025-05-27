// Only types/interfaces and Zod schemas that do NOT use drizzle/db code
import { z } from 'zod';

export type GridPosition = {
  row: number;
  col: number;
  letter: string;
  filled: boolean;
};

export type WordDirection = "across" | "down";

export type Word = {
  text: string;
  startPosition: { row: number; col: number };
  direction: WordDirection;
};

export type GameLevel = {
  id: number;
  name: string;
  gridSize: { rows: number; cols: number };
  grid: GridPosition[][];
  words: Word[];
  availableLetters: string[];
};

export type UserGameState = {
  foundWords: string[];
  currentLevel: GameLevel;
  progress: number; // 0-100
};

export type LeaderboardEntry = {
  id: number;
  userId: number; // Changed from string to number to match DB
  score: number;
  level: number; // Added, as it's in DB and used in storage
  timestamp: Date; // Changed to Date for consistency with DB/server logic
  rank?: number;
  wordsFound?: string[];
};
export type User = {
  id: number;
  username: string;
  coins: number;
  currentLevel: number;
  hintsRemaining: number;
  settings: {
    musicEnabled: boolean;
    sfxEnabled: boolean;
    theme: string;
    difficulty: string;
  };
};

export type MultiplayerRoom = {
  id: number;
  code: string;
  hostId: number;
  levelId: number;
  maxPlayers: number;
  status: string;
  createdAt: Date;
};

export type UserLevelProgress = {
  id: number;
  userId: number;
  levelId: number;
  completed: boolean;
  stars: number;
  wordsFound: string[]; // Assuming string array for found words
  timeSpent: number; // Assuming in seconds or a consistent unit
  hintsUsed: number;
};
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