import type React from "react";
import { useEffect } from "react";

import { Board, GameOverlay } from "@/components";
import { useReversiGame } from "@/reversi/use-reversi-game";

export const Game: React.FC = () => {
	const { gameState, handleClick, handleAILevelChange, resetGame, player } =
		useReversiGame();

	// Handle board scaling based on window size
	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			const boardContainer = document.querySelector(
				".board-container",
			) as HTMLElement;
			if (boardContainer) {
				if (width < 700) {
					const containerWidth = boardContainer.offsetWidth;
					const scaler = containerWidth / 596;
					boardContainer.style.setProperty("--scaler", scaler.toString());
				} else {
					boardContainer.style.setProperty("--scaler", "1");
				}
			}
		};

		// Set initial scale
		handleResize();

		// Add resize event listener
		window.addEventListener("resize", handleResize);

		// Clean up
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-2 md:p-4">
			{/* Game Container with Dynamic Sizing */}
			<div className="bg-white rounded-2xl shadow-2xl p-6 max-w-[620px] w-full sm:max-w-[650px] md:max-w-[700px]">
				{/* Header Section: Turn, Score, and Turn Count */}
				<div className="text-center mb-6">
					<h1 className="text-3xl font-extrabold text-gray-800 mb-2">
						Reversi
					</h1>
					<div className="flex justify-center items-center space-x-4">
						<span
							className={`text-xl font-semibold ${
								gameState.turn === 1 ? "text-gray-900" : "text-gray-400"
							} transition-colors duration-300`}
						>
							BLACK: {gameState.score.black}
						</span>
						<span className="text-xl font-semibold text-gray-600">vs</span>
						<span
							className={`text-xl font-semibold ${
								gameState.turn === 2 ? "text-gray-900" : "text-gray-400"
							} transition-colors duration-300`}
						>
							WHITE: {gameState.score.white}
						</span>
					</div>
					<p className="text-sm text-gray-500 mt-1">
						Turn: {gameState.turnCount} |{" "}
						<span
							className={`font-bold ${
								gameState.turn === 1 ? "text-gray-900" : "text-gray-400"
							}`}
						>
							{gameState.turn === 1 ? "Black's Turn" : "White's Turn"}
						</span>
					</p>
				</div>

				{/* Board Wrapper with Fixed-Width Centering */}
				<div className="flex justify-center mb-6">
					<div className="board-container md:max-w-[596px]">
						<div className="board-scaler">
							<Board values={gameState.value} onClickSquare={handleClick} />
						</div>
					</div>
				</div>

				{/* Controls Section: AI Level and Reset Button */}
				<div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
					<div className="flex items-center space-x-2">
						<label
							htmlFor="ai-level"
							className="text-sm font-medium text-gray-700"
						>
							AI Level:
						</label>
						<select
							id="ai-level"
							value={gameState.aiLevel}
							onChange={handleAILevelChange}
							disabled={gameState.thinking}
							className={`p-2 rounded-lg border-2 ${
								gameState.thinking
									? "border-gray-300 bg-gray-100 cursor-not-allowed"
									: "border-indigo-500 hover:border-indigo-600"
							} focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 text-gray-800`}
						>
							<option value="0">0 - Very Easy</option>
							<option value="1">1 - Easy</option>
							<option value="2">2 - Medium</option>
							<option value="3">3 - Standard</option>
							<option value="4">4 - Hard</option>
							<option value="5">5 - Expert</option>
						</select>
					</div>
					<button
						onClick={resetGame}
						disabled={gameState.thinking}
						type="button"
						className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
							gameState.thinking
								? "bg-gray-400 cursor-not-allowed"
								: "bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl"
						}`}
					>
						Reset Game
					</button>
				</div>
			</div>

			{/* Game Overlay (for thinking or game over) */}
			<GameOverlay
				thinking={gameState.thinking}
				gameStatus={gameState.gameStatus}
				playerColor={player}
				onNewGame={resetGame}
			/>
		</div>
	);
};
