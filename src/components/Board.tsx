import type React from "react";

import type { Square as SquareEnum } from "../game/reversi";
import { type Player, type SoundEffect, Stone } from "./index";

/**
 * Board are coordinated in x-y axis addressed from 0 to 7 and caller
 * shall initialize two dimensional vector with 0.
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
 * @param value - A two dimensional vector value representing a game
 * @param onClickSquare - A callback function when user clicks a board
 */
export interface Props {
    animate?: boolean;
    player?: Player;
    sound?: SoundEffect;
    values: SquareEnum[][];
    onClickSquare?: (x: number, y: number) => void;
}

export const Board: React.FC<Props> = ({ onClickSquare, player, values }) => {
    return (
        <div className="border-2 border-black flex-row gap-0">
            {values.map((row, idxY) => (
                <div className="h-[74px] p-0 m-0 flex-row" key={idxY}>
                    {row.map((value, idxX) => (
                        <Stone
                            key={`${idxX}-${idxY}`}
                            x={idxX}
                            y={idxY}
                            value={value}
                            canPlace={true}
                            hoveringColor={player}
                            onClick={onClickSquare}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Board;
