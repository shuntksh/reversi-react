import * as React from "react";

import { SquareState } from "./index";
import * as css from "./index.css";

export interface SquareProps {
    x: number;
    y: number;
    value: SquareState; // Enum 0, 1, 2
    onClick(ev: React.SyntheticEvent<MouseEvent>, x: number, y: number): any;
}

export class Square extends React.PureComponent<{}, {}> {
    public render() {
        return (
        <div className={css.square}>Test</div>
        );
    }
}

export default Square;
