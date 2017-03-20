import * as React from "react";

import { Square } from "./components";

/**
 * Board are cordinated in x-y axis addressed from 0 to 7 and caller
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
 */
export class Reversi extends React.PureComponent<{}, {}> {
    public state = { value: 0 };

    public toBlack = () => this.setState({ value: 1 });
    public toWhite = () => this.setState({ value: 2 });
    public reset = () => this.setState({ value: 0 });

    public render() {
        return (
        <div style={{ margin: "100px" }}>
            <div style={{ display: "block", paddingLeft: "40px" }}>
                <Square value={this.state.value} dot={1} />
            </div>
            <div style={{ margin: "10px", display: "inline-block" }}>
                <button onClick={this.reset}>Reset</button>
                <button onClick={this.toBlack}>Black</button>
                <button onClick={this.toWhite}>White</button>
            </div>
        </div>
        );
    }
}

export default Reversi;
