import * as React from "react";
import styled from "styled-components";

import { Square as SquareEnum } from "../Reversi";
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
export interface Props {
    animate?: boolean;
    player?: Player;
    sound?: SoundEffect;
    values: SquareEnum[][];
    placeable: SquareEnum[][];
    onClickSquare?: (x: number, y: number) => void;
}

export class Board extends React.Component<Props, {}> {
    public render() {
        const { onClickSquare, player, values, placeable } = this.props;
        return (
            <BoardOuter>
                {values.map((row, idxY) => (
                    <Row key={idxY}>
                        {row.map((value, idxX) => (
                            <Square
                                key={idxX}
                                x={idxX}
                                y={idxY}
                                value={value}
                                placeable={placeable[idxY][idxX]}
                                canPlace={true}
                                hoveringColor={player}
                                onClick={onClickSquare}
                            />
                        ))}
                    </Row>
                ))}
            </BoardOuter>
        );
    }
}

export default Board;

const BoardOuter = styled.div`
    border: solid 5px #000;
    width: 608px;
    height: 608px;
`;

const Row = styled.div`
    display: block;
    height: 76px;
`;
