import type { Move, Square } from "./game";
import { Player, Reversi } from "./game";

interface BestMove extends Move {
	score: number;
}

/**
 * Position weights for board evaluation
 * Corners (100): Most valuable positions that can't be flipped
 * Edge positions: Relatively valuable but can be dangerous next to corners (-20)
 * Center positions: Neutral value as they provide mobility
 */
const WEIGHTS = [
	[100, -20, 10, 5, 5, 10, -20, 100],
	[-20, -30, -5, -5, -5, -5, -30, -20],
	[10, -5, 0, 0, 0, 0, -5, 10],
	[5, -5, 0, 0, 0, 0, -5, 5],
	[5, -5, 0, 0, 0, 0, -5, 5],
	[10, -5, 0, 0, 0, 0, -5, 10],
	[-20, -30, -5, -5, -5, -5, -30, -20],
	[100, -20, 10, 5, 5, 10, -20, 100],
];

// Cache for storing previously computed positions to avoid redundant calculations
const transpositionTable = new Map<
	string,
	{ score: number; depth: number; move: Move }
>();
const MAX_TABLE_SIZE = 10000;

/**
 * Creates a unique key for a board position and player
 * @param board - Current board state
 * @param player - Current player
 * @returns String representation of the board state
 */
const getBoardKey = (board: Square[][], player: number): string => {
	return `${player}${board.flat().join("")}`;
};

/**
 * Evaluates the board position for the given player
 * @param game - Current game state
 * @param player - Player to evaluate for
 * @returns Numerical score representing the position strength
 */
const evaluateBoard = (game: Reversi, player: number): number => {
	const board = game.value;
	const totalPieces = game.score.black + game.score.white;
	let score = 0;

	// Calculate position-based score using the weight matrix
	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 8; x++) {
			if (board[y][x] === player) {
				score += WEIGHTS[y][x];
			} else if (board[y][x] === 3 - player) {
				score -= WEIGHTS[y][x];
			}
		}
	}

	// Early game: prioritize mobility (available moves)
	if (totalPieces < 20) {
		const playerMobility = game.possibleMoves(player).length;
		const opponentMobility = game.possibleMoves((3 - player) as Player).length;
		score += (playerMobility - opponentMobility) * 5;
	}
	// Late game: prioritize piece count
	else if (totalPieces > 50) {
		score +=
			(game.score[player === Player.black ? "black" : "white"] -
				game.score[player === Player.black ? "white" : "black"]) *
			10;
	}

	return score;
};

/**
 * Orders moves by their potential value to improve alpha-beta pruning efficiency
 * @param moves - List of possible moves
 * @returns Sorted list of moves with best positions first
 */
const orderMoves = (moves: Move[]): Move[] => {
	return moves.sort((a, b) => {
		const aScore = WEIGHTS[a.y - 1][a.x - 1];
		const bScore = WEIGHTS[b.y - 1][b.x - 1];
		return bScore - aScore;
	});
};

/**
 * Returns a random valid move for the current game state
 * @param game - Current game state
 * @returns Move object with x,y coordinates and score
 */
export const random = (game: Reversi): BestMove => {
	const possibleMoves = game.possibleMoves();
	if (!possibleMoves.length) return { x: -1, y: -1, score: 0 };
	const idx = Math.floor(Math.random() * possibleMoves.length);
	return { x: possibleMoves[idx].x - 1, y: possibleMoves[idx].y - 1, score: 0 };
};

/**
 * Minimax algorithm with alpha-beta pruning for Reversi move search
 *
 * Minimax is a decision-making algorithm for minimizing possible loss in a worst-case scenario.
 * Alpha-beta pruning optimizes minimax by eliminating branches that cannot influence the final decision.
 *
 * @param game - Current game state
 * @param depth - How many moves to look ahead
 * @param alpha - Best score the maximizing player can guarantee (initially -Infinity)
 * @param beta - Best score the minimizing player can guarantee (initially +Infinity)
 * @param maximizingPlayer - Whether current player is maximizing (true) or minimizing (false)
 * @param startTime - When the search started
 * @param timeLimit - Maximum allowed computation time in ms
 * @returns Best move with its associated score
 */
const minMax = (
	game: Reversi,
	depth: number,
	alpha: number,
	beta: number,
	maximizingPlayer: boolean,
	startTime: number,
	timeLimit: number,
): BestMove => {
	const currentPlayer = game.turn;
	const possibleMoves = orderMoves(game.possibleMoves(currentPlayer));

	// Terminal conditions: time limit reached, max depth reached, or no moves available
	if (
		Date.now() - startTime > timeLimit ||
		depth === 0 ||
		!possibleMoves.length
	) {
		return { x: -1, y: -1, score: evaluateBoard(game, currentPlayer) };
	}

	// Check transposition table for previously computed position
	const key = getBoardKey(game.value, currentPlayer) + depth;
	if (transpositionTable.has(key)) {
		const entry = transpositionTable.get(key);
		if (entry && entry.depth >= depth)
			return { ...entry.move, score: entry.score };
	}

	// Initialize best move with worst possible score based on player
	let bestMove: BestMove = {
		x: -1,
		y: -1,
		score: maximizingPlayer
			? Number.NEGATIVE_INFINITY
			: Number.POSITIVE_INFINITY,
	};
	let [_alpha, _beta] = [alpha, beta];

	// Try each possible move
	for (const move of possibleMoves) {
		// Make the move and get resulting board changes
		const changes = game.placeStone(
			move.x - 1,
			move.y - 1,
			currentPlayer,
			false,
		);
		if (changes.length === 0) continue;

		// Switch to opponent's turn
		const originalTurn = game.turn;
		game.turn = (3 - game.turn) as Player;

		// Recursively evaluate the resulting position
		const result = minMax(
			game,
			depth - 1,
			_alpha,
			_beta,
			!maximizingPlayer,
			startTime,
			timeLimit,
		);

		// Undo the move to restore the board state
		game.undoMove(changes);
		game.turn = originalTurn;

		// Update best move based on player type (maximizing or minimizing)
		if (maximizingPlayer) {
			if (result.score > bestMove.score) {
				bestMove = { x: move.x - 1, y: move.y - 1, score: result.score };
			}
			_alpha = Math.max(_alpha, result.score);
		} else {
			if (result.score < bestMove.score) {
				bestMove = { x: move.x - 1, y: move.y - 1, score: result.score };
			}
			_beta = Math.min(_beta, result.score);
		}

		// Alpha-beta pruning: if alpha >= beta, remaining branches won't affect the result
		if (_beta <= _alpha) break;
	}

	// Store result in transposition table for future lookups
	if (transpositionTable.size < MAX_TABLE_SIZE) {
		transpositionTable.set(key, {
			score: bestMove.score,
			depth,
			move: bestMove,
		});
	}

	return bestMove;
};

/**
 * Uses iterative deepening to find the best move within time constraints
 * Starts with shallow searches and incrementally deepens until time runs out
 *
 * @param game - Current game state
 * @param level - Difficulty level that influences search depth
 * @param timeLimit - Maximum allowed computation time in ms
 * @returns Best move found within the time limit
 */
const iterativeDeepening = (
	game: Reversi,
	level: number,
	timeLimit: number,
): BestMove => {
	const startTime = Date.now();
	const totalPieces = game.score.black + game.score.white;
	// Adjust max depth based on game progress and difficulty level
	const maxDepth = Math.min(
		level + 1,
		Math.max(2, Math.floor(totalPieces / 10)),
	);
	let bestMove: BestMove = { x: -1, y: -1, score: Number.NEGATIVE_INFINITY };

	// Progressively search deeper until time runs out
	for (let depth = 1; depth <= maxDepth; depth++) {
		if (Date.now() - startTime > timeLimit * 0.9) break;
		const result = minMax(
			game,
			depth,
			Number.NEGATIVE_INFINITY,
			Number.POSITIVE_INFINITY,
			true,
			startTime,
			timeLimit,
		);
		if (result.x !== -1) bestMove = result;
	}

	return bestMove;
};

/**
 * Main solver function that determines the next best move based on difficulty level
 *
 * @param game - Current game state
 * @param level - Difficulty level (0-4, where 0 is random and 4 is hardest)
 * @returns Best move with its associated score
 */
export const solver = (game: Reversi, level = 3): BestMove => {
	// Level 0: completely random moves
	if (level === 0) return random(game);

	const possibleMoves = game.possibleMoves();
	if (!possibleMoves.length) return { x: -1, y: -1, score: 0 };

	// Add randomness based on difficulty to make lower levels more beatable
	if (Math.random() < (5 - level) * 0.1) return random(game);

	// Time limit scales with difficulty level
	const timeLimit = 100 + level * 100;
	return iterativeDeepening(game, level, timeLimit);
};

/**
 * Computes and executes the next AI move asynchronously
 *
 * @param game - Current game state
 * @param cb - Optional callback function to run after move is made
 * @param level - Difficulty level
 */
export const computeNextMove = (
	game: Reversi,
	cb?: () => void,
	level = 3,
): void => {
	const _game = new Reversi().copy(game);
	setTimeout(() => {
		const move = solver(_game, level);
		if (move.x !== -1) game.placeStone(move.x, move.y);
		if (cb) cb();
	}, 0);
};

export default computeNextMove;
