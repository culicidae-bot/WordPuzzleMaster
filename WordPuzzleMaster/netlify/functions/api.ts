// Using proper TypeScript imports
import express from 'express';
import serverless from 'serverless-http';

// Create an Express app
const api = express();

// Parse JSON request body
api.use(express.json());

// Create a router for API endpoints
const router = express.Router();

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    username: "player1",
    coins: 500,
    currentLevel: 2,
    hintsRemaining: 3,
    settings: {
      musicEnabled: true,
      sfxEnabled: true,
      theme: "magical",
      difficulty: "beginner"
    }
  },
  {
    id: 2,
    username: "player2",
    coins: 750,
    currentLevel: 3,
    hintsRemaining: 2,
    settings: {
      musicEnabled: false,
      sfxEnabled: true,
      theme: "dark",
      difficulty: "intermediate"
    }
  }
];

// User routes
router.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  res.status(200).json(user);
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Add more API routes as needed...

// Use the router for all routes
api.use('/', router);

// Export the serverless handler
export const handler = serverless(api);