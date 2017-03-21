import * as React from "react";

import { Board, PieceState } from "./components";

const values: PieceState[][] = [];
for (let y = 0; y < 8; y++) {
    const Y: PieceState[] = [];
    for (let x = 0; x < 8; x++) {
        if (x === 3 && y === 3 || x === 4 && y === 4) {
            Y.push(1);
        } else if (x === 3 && y === 4 || x === 4 && y === 3) {
            Y.push(2);
        } else {
            Y.push(0);
        }
    }
    values.push(Y);
}

export class Main extends React.PureComponent<{}, {}> {
    public state = { values };

    public handleClick = (x: number, y: number) => {
        console.log(x, y);
        const _values = [...values];
        _values[y][x] = values[y][x] ? 3 - values[y][x] : 1;
        this.setState({ values: _values });
    }

    public shouldComponentUpdate() {
        return true;
    }

    public render() {
        console.log(values);
        return (
            <div style={{ display: "block", marginLeft: "40px" }}>
                <Board values={values} onClickSquare={this.handleClick} />
            </div>
        );
    }
}

export default Main;
