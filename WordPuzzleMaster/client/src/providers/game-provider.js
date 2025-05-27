import { createContext, useState, useCallback } from "react";
export const GameContext = createContext(undefined);
export function GameProvider({ children }) {
    const [gameState, setGameState] = useState({
        user: null,
        currentLevel: null,
        foundWords: [],
        hintsUsed: 0
    });
    const initializeUser = useCallback((user) => {
        setGameState(prev => (Object.assign(Object.assign({}, prev), { user })));
    }, []);
    const updateSettings = useCallback((settings) => {
        setGameState(prev => {
            if (!prev.user)
                return prev;
            return Object.assign(Object.assign({}, prev), { user: Object.assign(Object.assign({}, prev.user), { settings }) });
        });
    }, []);
    const updateFoundWords = useCallback((word) => {
        setGameState(prev => (Object.assign(Object.assign({}, prev), { foundWords: [...prev.foundWords, word] })));
    }, []);
    const addCoins = useCallback((amount) => {
        setGameState(prev => {
            if (!prev.user)
                return prev;
            return Object.assign(Object.assign({}, prev), { user: Object.assign(Object.assign({}, prev.user), { coins: prev.user.coins + amount }) });
        });
    }, []);
    const completeLevel = useCallback((levelId, stats) => {
        setGameState(prev => {
            if (!prev.user)
                return prev;
            // Update current level if user just completed their current level
            const newCurrentLevel = levelId === prev.user.currentLevel
                ? levelId + 1
                : prev.user.currentLevel;
            return Object.assign(Object.assign({}, prev), { user: Object.assign(Object.assign({}, prev.user), { currentLevel: newCurrentLevel }), hintsUsed: stats.hintsUsed, foundWords: stats.foundWords });
        });
    }, []);
    return (<GameContext.Provider value={{
            gameState,
            initializeUser,
            updateSettings,
            updateFoundWords,
            addCoins,
            completeLevel
        }}>
      {children}
    </GameContext.Provider>);
}
