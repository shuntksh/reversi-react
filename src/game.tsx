import type React from "react";
import { useCallback, useEffect, useState } from "react";

import { Board, Player } from "./components";
import type { Square } from "./game/reversi";
import Reversi from "./game/reversi";

const game = new Reversi();

export interface ContainerState {
    value: Square[][];
    turn: number;
    turnCount: number;
    score: { black: number; white: number };
    aiLevel: number;
    thinking: boolean;
}

// Thinking overlay component
const ThinkingOverlay: React.FC = () => (
    <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    }}>
        <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <div style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
                AI is thinking...
            </div>
            <div className="thinking-animation" style={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#333',
                    borderRadius: '50%',
                    margin: '0 4px',
                    animation: 'pulse 1s infinite ease-in-out',
                    animationDelay: '0s',
                }}/>
                <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#333',
                    borderRadius: '50%',
                    margin: '0 4px',
                    animation: 'pulse 1s infinite ease-in-out',
                    animationDelay: '0.2s',
                }}/>
                <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#333',
                    borderRadius: '50%',
                    margin: '0 4px',
                    animation: 'pulse 1s infinite ease-in-out',
                    animationDelay: '0.4s',
                }}/>
            </div>
            <style>
                {`
                @keyframes pulse {
                    0%, 100% { transform: scale(0.8); opacity: 0.5; }
                    50% { transform: scale(1.2); opacity: 1; }
                }
                `}
            </style>
        </div>
    </div>
);

export const Game: React.FC = () => {
    const [gameState, setGameState] = useState<ContainerState>({
        score: { white: 2, black: 2 },
        turn: game.turn,
        turnCount: game.turnCount,
        value: game.value,
        aiLevel: 3,
        thinking: false
    });

    const updateBoard = useCallback(() => {
        setGameState({
            score: game.score,
            turn: game.turn,
            turnCount: game.turnCount,
            value: game.value,
            aiLevel: gameState.aiLevel,
            thinking: game.thinking
        });
    }, [gameState.aiLevel]);

    // Update the UI when the thinking state changes
    useEffect(() => {
        const thinkingInterval = setInterval(() => {
            // Update the game state if thinking status changed
            if (gameState.thinking !== game.thinking) {
                updateBoard();
            }
        }, 16); // Check frequently for smoother transitions (60fps)
        
        return () => clearInterval(thinkingInterval);
    }, [gameState.thinking, updateBoard]);

    const handleClick = useCallback((x: number, y: number) => {
        // Only allow moves when AI is not thinking
        if (!gameState.thinking) {
            game.placeStone(x, y, undefined, updateBoard);
            updateBoard();
        }
    }, [gameState.thinking, updateBoard]);

    const handleAILevelChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLevel = Number.parseInt(e.target.value, 10);
        setGameState(prev => ({ ...prev, aiLevel: newLevel }));
        game.init(Player.black, newLevel);
        updateBoard();
    }, [updateBoard]);

    const resetGame = useCallback(() => {
        game.init(Player.black, gameState.aiLevel);
        updateBoard();
    }, [gameState.aiLevel, updateBoard]);

    useEffect(() => {
        game.init(Player.black, gameState.aiLevel);
        updateBoard();
    }, [gameState.aiLevel, updateBoard]);

    return (
        <div style={{ display: "block", marginLeft: "40px", position: "relative" }}>
            <div style={{ marginBottom: "10px" }}>
                <div>
                    {gameState.turn === 1 ? "BLACK" : "WHITE"} - {gameState.turnCount} - score: B=
                    {gameState.score.black} / W=
                    {gameState.score.white}
                </div>
                <div style={{ marginTop: "10px" }}>
                    <label htmlFor="ai-level">AI Level: </label>
                    <select 
                        id="ai-level" 
                        value={gameState.aiLevel} 
                        onChange={handleAILevelChange}
                        style={{ marginRight: "10px" }}
                        disabled={gameState.thinking}
                    >
                        <option value="0">0 - Very Easy</option>
                        <option value="1">1 - Easy</option>
                        <option value="2">2 - Medium</option>
                        <option value="3">3 - Standard</option>
                        <option value="4">4 - Hard</option>
                        <option value="5">5 - Expert</option>
                    </select>
                    <button onClick={resetGame} disabled={gameState.thinking} type="button">Reset Game</button>
                </div>
            </div>
            <Board values={gameState.value} onClickSquare={handleClick} />
            {gameState.thinking && <ThinkingOverlay />}
        </div>
    );
};

