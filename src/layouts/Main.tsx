import * as React from "react";

import { Square } from "../components/Board";

export class Main extends React.PureComponent<{}, {}> {
    public render() {
        return <div><Square /></div>;
    }
}

export default Main;
