import * as React from "react";

import { Square } from "./components";

export class Reversi extends React.PureComponent<{}, {}> {
    public state = { value: 0 };

    public toBlack = () => this.setState({ value: 1 });
    public toWhite = () => this.setState({ value: 2 });

    public render() {
        return (
        <div style={{ margin: "100px" }}>
            <div style={{ display: "inline-block" }}>
                <Square  value={this.state.value}/>
            </div>
            <div style={{ margin: "10px", display: "inline-block" }}>
                <button onClick={this.toWhite}>White</button>
                <button onClick={this.toBlack}>Black</button>
            </div>
        </div>
        );
    }
}

export default Reversi;
