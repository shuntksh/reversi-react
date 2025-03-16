export { Board, type Props as BoardProps } from "./board";
export { Dot, Stone, type Props as StoneProps } from "./stone";

export enum Player {
    black = 1,
    white = 2,
}

export interface SoundEffect {
    sound: boolean;
    srcBlack: string;
    srcWhite: string;
}
