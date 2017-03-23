import * as React from "react";

import { Square as SquareEnum } from "../game/Reversi";
import * as css from "./Board.css";
import { Player, SoundEffect, Square } from "./index";

/**
 * Board are cordinated in x-y axis addressed from 0 to 7 and caller
 * shall initialize two dimentional vector with 0.
 *
 *    value[y][x]=
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
    animate?: boolean;
    player?: Player;
    sound?: SoundEffect;
    values: SquareEnum[][];
    onClickSquare?: (x: number, y: number) => void;
}

export class Board extends React.Component<BoardProps, {}> {
    public render() {
        const { onClickSquare, values } = this.props;
        return (
            <div className={css.board}>
            {values.map((row, idxY) => (
                <div key={idxY} className={css.row}>
                    {row.map((value, idxX) => (
                    <Square
                        key={idxX}
                        x={idxX}
                        y={idxY}
                        value={value}
                        onClick={onClickSquare}
                    />
                    ))}
                </div>
            ))}
            </div>
        );
    }
}

export default Board;
