
import { Dot, PieceState, Square, SquareProps } from "./Square";

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

/**
 * Squares are cordinated in x-y axis addressed from 0 to 7 and caller
 * shall initialize two dimentional vector with 0.
 *
 *      0 1 2 3 4 5 6 7 (x)
 *    0
 *    1
 *    :
 *    6
 *    7
 *   (y)
 *
 * @param animate - Perform flip animation when true (default=true)
 * @param player - A number that specify player of the turn (1 = black, 2 = white)
 * @param sound - An object to specify audio URL for each player
 * @param value - A two dimentional vector value representing a game
 * @param onClickSquare - A callback function when user clicks a board
 */
export interface BoardProps {
    animate: boolean;
    player: Player;
    sound: SoundEffect;
    value: PieceState[][];
    onClickSquare(x: number, y: number): void;
}
