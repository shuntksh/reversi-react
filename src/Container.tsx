import * as React from "react";

import { Board } from "./components";
import Reversi, { Square as SquareEnum } from "./Reversi";

const game = new Reversi();

export interface ContainerState {
    value: SquareEnum[][];
    turn: number;
    turnCount: number;
    score: { black: number, white: number };
}

export class Container extends React.PureComponent<{}, ContainerState> {
    public state = { value: game.value, turn: game.turn, turnCount: game.turnCount, score: { white: 2, black: 2 } };

    public updateBoard = () => {
        this.setState({ value: game.value, turn: game.turn, turnCount: game.turnCount, score: game.score });
    }

    public handleClick = (x: number, y: number) => {
        game.placeStone(x, y, undefined, this.updateBoard);
        this.updateBoard();
    }

    public render() {
        return (
            <div style={{ display: "block", marginLeft: "40px" }}>
                {this.state.turn === 1 ? "BLACK" : "WHITE"} - {this.state.turnCount} -
                score: B={this.state.score.black} / W={this.state.score.white}
                <Board values={this.state.value} onClickSquare={this.handleClick} />
            </div>
        );
    }
}

export default Container;
