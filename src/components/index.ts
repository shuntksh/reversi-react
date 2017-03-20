
import { Board, BoardProps } from "./Board";
import { Dot, PieceState, Square, SquareProps } from "./Square";

export { Board, BoardProps };
export { Dot, PieceState, Square, SquareProps };

export enum Player {
    black = 1,
    white = 2,
}

export interface SoundEffect {
    sound: boolean;
    srcBlack: string;
    srcWhite: string;
}
