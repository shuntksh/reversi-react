import type React from "react";

import type { GameStatus } from "../reversi/game";
import { Player } from "../reversi/game";

interface GameOverlayProps {
	thinking?: boolean;
	gameStatus?: GameStatus;
	playerColor?: Player;
	onNewGame?: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
	thinking = false,
	gameStatus,
	playerColor = Player.black,
	onNewGame,
}) => {
	// Show thinking spinner
	if (thinking) {
		return (
			<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
				<div className="flex flex-col items-center">
					<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500" />
					<p className="mt-4 text-white text-lg font-semibold animate-pulse">
						AI is thinking...
					</p>
				</div>
			</div>
		);
	}

	// Show game result if game is finished
	if (gameStatus && gameStatus !== "inProgress") {
		let resultMessage = "Game Over!";
		let resultClass = "text-white";

		if (gameStatus === "blackWins") {
			resultMessage = playerColor === Player.black ? "You Win!" : "You Lose!";
			resultClass =
				playerColor === Player.black ? "text-green-400" : "text-red-400";
		} else if (gameStatus === "whiteWins") {
			resultMessage = playerColor === Player.white ? "You Win!" : "You Lose!";
			resultClass =
				playerColor === Player.white ? "text-green-400" : "text-red-400";
		} else if (gameStatus === "draw") {
			resultMessage = "It's a Draw!";
			resultClass = "text-yellow-400";
		}

		return (
			<div className="absolute inset-0 bg-black/70 flex items-center justify-center">
				<div className="bg-gray-800 rounded-xl p-8 flex flex-col items-center shadow-2xl max-w-md w-full mx-4">
					<h2 className={`text-4xl font-bold mb-4 ${resultClass}`}>
						{resultMessage}
					</h2>
					<button
						onClick={onNewGame}
						type="button"
						className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-200 transform hover:scale-105"
					>
						New Game
					</button>
				</div>
			</div>
		);
	}

	// Return null if no overlay should be shown
	return null;
};

// For backward compatibility
export const ThinkingOverlay: React.FC = () => <GameOverlay thinking={true} />;
