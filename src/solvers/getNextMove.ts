/* tslint:disable */
import { Move, Reversi } from "../Reversi";

interface BestMove extends Move {
    score: number;
}

// interface Score {
//     black: number;
//     white: number;
// }

// const evalScore = (game: Reversi): Score => {
//     let white = 0;
//     let black = 0;
//     const weight = [
//         // src: http://uguisu.skr.jp/othello/5-1.html
//         [30, -12, 0, -1, -1, 0, -12, 30],
//         [-12, -15, -3, -3, -3, -3, -15, -12],
//         [0, -3, 0, -1, -1, 0, -3, 0],
//         [-1, -3, -1, -1, -1, -1, -3, -1],
//         [-1, -3, -1, -1, -1, -1, -3, -1],
//         [0, -3, 0, -1, -1, 0, -3, 0],
//         [-12, -15, -3, -3, -3, -3, -15, -12],
//         [30, -12, 0, -1, -1, 0, -12, 30],
//     ];
//     for (let y = 0; y < 8; y++) {
//         for (let x = 0; x < 8; x++) {
//             if (game.value[y][x] === Square.white) {
//                 white += weight[y][x];
//             } else if (game.value[y][x] === Square.black) {
//                 black += weight[y][x];
//             }
//         }
//     }
//     return { black, white };
// };

export const random = (game: Reversi): BestMove => {
    const bestMove: BestMove = { x: -1, y: -1, score: -1 };
    const possibleMoves = game.possibleMoves();
    if (game.finished || !possibleMoves.length) {
        return bestMove;
    }
    const idx = Math.floor(Math.random() * possibleMoves.length);
    bestMove.x = possibleMoves[idx].x - 1;
    bestMove.y = possibleMoves[idx].y - 1;
    return bestMove;
};

// export const minMax = (game: Reversi, depth: number = 5, maxDepth: number = 5): BestMove => {
//     const bestMove: BestMove = { x: -1, y: -1, score: -1 };
//     const possibleMoves = game.possibleMoves();
//     if (game.finished || !possibleMoves.length) {
//         return bestMove;
//     }

//     // Initialize
//     // const score = evalScore(game);
//     if (game.turn) {
//     }

//     // Find the best move (maximize the score f)
//     // for (const move of possibleMoves) {
//     // }

//     return bestMove;
// };

export const computeNextMove = (game: Reversi, cb?: () => any): void => {
    const _game = new Reversi().copy(game);
    const move = random(_game);
    game.placeStone(move.x, move.y);
    if (typeof cb === "function") {
        cb();
    }
};

export default computeNextMove;
