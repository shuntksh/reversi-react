import { useCallback, useEffect, useState } from "react";
import type { Square } from "./game";
import Reversi, { GameStatus, Player } from "./game";

export interface GameState {
	value: Square[][];
	turn: number;
	turnCount: number;
	score: { black: number; white: number };
	aiLevel: number;
	thinking: boolean;
	gameStatus: GameStatus;
}

export const useReversiGame = () => {
	// Create a single instance of the game
	const [game] = useState(() => new Reversi());

	// State to track the game state
	const [gameState, setGameState] = useState<GameState>({
		score: { white: 2, black: 2 },
		turn: game.turn,
		turnCount: game.turnCount,
		value: game.value,
		aiLevel: 3,
		thinking: false,
		gameStatus: GameStatus.inProgress,
	});

	// Update the UI state from the game instance
	const updateBoard = useCallback(() => {
		setGameState({
			score: game.score,
			turn: game.turn,
			turnCount: game.turnCount,
			value: game.value,
			aiLevel: game.aiLevel,
			thinking: game.thinking,
			gameStatus: game.gameStatus,
		});
	}, [game]);

	// Handle square click to place a stone
	const handleClick = useCallback(
		(x: number, y: number) => {
			if (
				!gameState.thinking &&
				gameState.gameStatus === GameStatus.inProgress
			) {
				game.placeStone(x, y, undefined, true);
				updateBoard();
			}
		},
		[game, gameState.thinking, gameState.gameStatus, updateBoard],
	);

	// Handle AI level change
	const handleAILevelChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			const newLevel = Number.parseInt(e.target.value, 10);
			setGameState((prev) => ({ ...prev, aiLevel: newLevel }));
			game.init(Player.black, newLevel);
			updateBoard();
		},
		[game, updateBoard],
	);

	// Reset the game
	const resetGame = useCallback(() => {
		game.init(Player.black, gameState.aiLevel);
		updateBoard();
	}, [game, gameState.aiLevel, updateBoard]);

	// Poll for updates when AI is thinking
	useEffect(() => {
		const thinkingInterval = setInterval(() => {
			if (
				gameState.thinking !== game.thinking ||
				gameState.gameStatus !== game.gameStatus
			) {
				updateBoard();
			}
		}, 16);
		return () => clearInterval(thinkingInterval);
	}, [game, gameState.thinking, gameState.gameStatus, updateBoard]);

	// Initialize the game on mount and when AI level changes
	useEffect(() => {
		game.init(Player.black, gameState.aiLevel);
		updateBoard();
	}, [game, gameState.aiLevel, updateBoard]);

	return {
		gameState,
		handleClick,
		handleAILevelChange,
		resetGame,
		player: game.player,
	};
};
