import * as React from "react";

import { Board } from "./components";
import Reversi, { Square as SquareEnum } from "./game/Reversi";

const game = new Reversi();

export interface MainState {
    value: SquareEnum[][];
    turn: number;
    turnCount: number;
}

export class Main extends React.PureComponent<{}, MainState> {
    public state = { value: game.value, turn: game.turn, turnCount: game.turnCount };

    public handleClick = (x: number, y: number) => {
        game.move(x, y);
        this.setState({ value: game.value, turn: game.turn, turnCount: game.turnCount });
    }

    public render() {
        return (
            <div style={{ display: "block", marginLeft: "40px" }}>
                {this.state.turn === 1 ? "BLACK" : "WHITE"} - {this.state.turnCount}
                <Board values={this.state.value} onClickSquare={this.handleClick} />
            </div>
        );
    }
}

export default Main;
