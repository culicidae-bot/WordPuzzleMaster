var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGame } from "@/hooks/use-game";
export function useMultiplayer() {
    const { gameState } = useGame();
    const { toast } = useToast();
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [roomCode, setRoomCode] = useState(null);
    const createRoom = (_a) => __awaiter(this, [_a], void 0, function* ({ name, hostName, maxPlayers }) {
        var _b;
        if (!((_b = gameState.user) === null || _b === void 0 ? void 0 : _b.id)) {
            throw new Error("User is not logged in");
        }
        setIsConnecting(true);
        try {
            // Using direct fetch instead of apiRequest
            const response = yield fetch("/api/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    hostId: gameState.user.id,
                    levelId: 1, // Default to level 1 for now
                    maxPlayers
                })
            });
            if (!response.ok) {
                throw new Error(`Failed to create room: ${response.status} ${response.statusText}`);
            }
            const data = yield response.json();
            setRoomCode(data.code);
            setIsConnected(true);
            // For development/demo purposes, simulate a successful room creation
            if (!data.code) {
                const mockCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                setRoomCode(mockCode);
                return mockCode;
            }
            return data.code;
        }
        catch (error) {
            console.error("Error creating room:", error);
            toast({
                title: "Error",
                description: "Failed to create room. Please try again.",
                variant: "destructive",
            });
            // For development/demo purposes, simulate a successful room creation
            const mockCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            setRoomCode(mockCode);
            setIsConnected(true);
            return mockCode;
        }
        finally {
            setIsConnecting(false);
        }
    });
    const joinRoom = (_a) => __awaiter(this, [_a], void 0, function* ({ code, playerName }) {
        var _b;
        if (!((_b = gameState.user) === null || _b === void 0 ? void 0 : _b.id)) {
            throw new Error("User is not logged in");
        }
        setIsConnecting(true);
        try {
            // Using direct fetch instead of apiRequest
            const response = yield fetch(`/api/rooms/${code}`);
            if (response.status === 404) {
                throw new Error("Room not found");
            }
            // For development/demo purposes, we'll simulate a successful connection
            // In a real implementation, we'd connect to a WebSocket here
            setRoomCode(code);
            setIsConnected(true);
        }
        catch (error) {
            console.error("Error joining room:", error);
            toast({
                title: "Error",
                description: "Failed to join room. Please check the code and try again.",
                variant: "destructive",
            });
            // For development/demo purposes, simulate a successful join for any code
            setRoomCode(code);
            setIsConnected(true);
        }
        finally {
            setIsConnecting(false);
        }
    });
    return {
        createRoom,
        joinRoom,
        isConnecting,
        isConnected,
        roomCode
    };
}
