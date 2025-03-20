import type { Move, Square } from "./reversi";
import { Player, Reversi } from "./reversi";

interface BestMove extends Move {
    score: number;
}

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

const transpositionTable = new Map<string, { score: number; depth: number; move: Move }>();
const MAX_TABLE_SIZE = 10000;

const getBoardKey = (board: Square[][], player: number): string => {
    return `${player}${board.flat().join("")}`;
};

const evaluateBoard = (game: Reversi, player: number): number => {
    const board = game.value;
    const totalPieces = game.score.black + game.score.white;
    let score = 0;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[y][x] === player) {
                score += WEIGHTS[y][x];
            } else if (board[y][x] === (3 - player)) {
                score -= WEIGHTS[y][x];
            }
        }
    }

    if (totalPieces < 20) {
        const playerMobility = game.possibleMoves(player).length;
        const opponentMobility = game.possibleMoves(3 - player as Player).length;
        score += (playerMobility - opponentMobility) * 5;
    } else if (totalPieces > 50) {
        score += (game.score[player === Player.black ? "black" : "white"] -
            game.score[player === Player.black ? "white" : "black"]) * 10;
    }

    return score;
};

const orderMoves = (moves: Move[]): Move[] => {
    return moves.sort((a, b) => {
        const aScore = WEIGHTS[a.y - 1][a.x - 1];
        const bScore = WEIGHTS[b.y - 1][b.x - 1];
        return bScore - aScore;
    });
};

export const random = (game: Reversi): BestMove => {
    const possibleMoves = game.possibleMoves();
    if (!possibleMoves.length) return { x: -1, y: -1, score: 0 };
    const idx = Math.floor(Math.random() * possibleMoves.length);
    return { x: possibleMoves[idx].x - 1, y: possibleMoves[idx].y - 1, score: 0 };
};

const minMax = (
    game: Reversi,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: boolean,
    startTime: number,
    timeLimit: number
): BestMove => {
    const currentPlayer = game.turn;
    const possibleMoves = orderMoves(game.possibleMoves(currentPlayer));

    if (Date.now() - startTime > timeLimit || depth === 0 || !possibleMoves.length) {
        return { x: -1, y: -1, score: evaluateBoard(game, currentPlayer) };
    }

    const key = getBoardKey(game.value, currentPlayer) + depth;
    if (transpositionTable.has(key)) {
        const entry = transpositionTable.get(key);
        if (entry && entry.depth >= depth) return { ...entry.move, score: entry.score };
    }

    let bestMove: BestMove = {
        x: -1,
        y: -1,
        score: maximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY
    };
    let [_alpha, _beta] = [alpha, beta];

    for (const move of possibleMoves) {
        const changes = game.placeStone(move.x - 1, move.y - 1, currentPlayer, false);
        if (changes.length === 0) continue;

        const originalTurn = game.turn;
        game.turn = 3 - game.turn as Player;

        const result = minMax(game, depth - 1, _alpha, _beta, !maximizingPlayer, startTime, timeLimit);

        game.undoMove(changes);
        game.turn = originalTurn;

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

        if (_beta <= _alpha) break;
    }

    if (transpositionTable.size < MAX_TABLE_SIZE) {
        transpositionTable.set(key, { score: bestMove.score, depth, move: bestMove });
    }

    return bestMove;
};

const iterativeDeepening = (game: Reversi, level: number, timeLimit: number): BestMove => {
    const startTime = Date.now();
    const totalPieces = game.score.black + game.score.white;
    const maxDepth = Math.min(level + 1, Math.max(2, Math.floor(totalPieces / 10)));
    let bestMove: BestMove = { x: -1, y: -1, score: Number.NEGATIVE_INFINITY };

    for (let depth = 1; depth <= maxDepth; depth++) {
        if (Date.now() - startTime > timeLimit * 0.9) break;
        const result = minMax(game, depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, startTime, timeLimit);
        if (result.x !== -1) bestMove = result;
    }

    return bestMove;
};

export const solver = (game: Reversi, level = 3): BestMove => {
    if (level === 0) return random(game);

    const possibleMoves = game.possibleMoves();
    if (!possibleMoves.length) return { x: -1, y: -1, score: 0 };

    if (Math.random() < (5 - level) * 0.1) return random(game);

    const timeLimit = 100 + level * 100;
    return iterativeDeepening(game, level, timeLimit);
};

export const computeNextMove = (game: Reversi, cb?: () => void, level = 3): void => {
    const _game = new Reversi().copy(game);
    setTimeout(() => {
        const move = solver(_game, level);
        if (move.x !== -1) game.placeStone(move.x, move.y);
        if (cb) cb();
    }, 0);
};

export default computeNextMove;