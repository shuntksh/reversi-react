import * as React from "react";

import { Square } from "./components";

export class Reversi extends React.PureComponent<{}, {}> {
    public state = { value: 0 };

    public toBlack = () => this.setState({ value: 1 });
    public toWhite = () => this.setState({ value: 2 });
    public reset = () => this.setState({ value: 0 });

    public render() {
        return (
        <div style={{ margin: "100px" }}>
            <div style={{ display: "block", paddingLeft: "40px" }}>
                <Square  value={this.state.value}/>
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
