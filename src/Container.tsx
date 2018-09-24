import * as React from "react";

import { Board } from "./components";
import Reversi, { Square as SquareEnum } from "./Reversi";

const game = new Reversi();

export interface ContainerState {
    value: SquareEnum[][];
    turn: number;
    turnCount: number;
    score: { black: number; white: number };
}

export class Container extends React.PureComponent<{}, ContainerState> {
    public state = {
        score: { white: 2, black: 2 },
        turn: game.turn,
        turnCount: game.turnCount,
        value: game.value,
    };

    public updateBoard = () => {
        this.setState({
            score: game.score,
            turn: game.turn,
            turnCount: game.turnCount,
            value: game.value,
        });
    };

    public handleClick = (x: number, y: number) => {
        game.placeStone(x, y, undefined, this.updateBoard);
        this.updateBoard();
    };

    public render() {
        return (
            <div style={{ display: "block", marginLeft: "40px" }}>
                {this.state.turn === 1 ? "BLACK" : "WHITE"} - {this.state.turnCount} - score: B=
                {this.state.score.black} / W=
                {this.state.score.white}
                <Board values={this.state.value} onClickSquare={this.handleClick} />
            </div>
        );
    }
}

export default Container;
