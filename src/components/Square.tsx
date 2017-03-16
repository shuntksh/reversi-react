import * as cx from "classnames";
import * as React from "react";

import { SquareState } from "./index";
import * as css from "./Square.css";

export interface SquareProps {
    x: number;  // Position
    y: number;  // POsition
    value: SquareState; // Enum 0, 1, 2
    onClick(ev: React.SyntheticEvent<MouseEvent>, x: number, y: number): any;
}

export class Square extends React.PureComponent<{}, {}> {
    public render() {
        const { value } = this.props;
        const cxSquare = [css.square];
        const cxPiece = [css.piece];
        return (
        <div className={cx(cxSquare)}>
            <div className={cx(cxPiece)} >
                <div className={css.head} />
                <div className={css.tail} />
            </div>
        </div>
        );
    }
}

export default Square;
