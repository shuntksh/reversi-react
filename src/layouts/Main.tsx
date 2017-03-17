import * as React from "react";

import { Square } from "../components";

export class Main extends React.PureComponent<{}, {}> {
    public render() {
        return <div style={{ margin: "100px" }}><Square /><Square /></div>;
    }
}

export default Main;
