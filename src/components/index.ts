export { Board, type Props as BoardProps } from "./board";
export { Dot, Square, type Props as SquareProps } from "./square";
export { GameOverlay, ThinkingOverlay } from "./thinking";

export enum Player {
	black = 1,
	white = 2,
}

export interface SoundEffect {
	sound: boolean;
	srcBlack: string;
	srcWhite: string;
}
