import * as cx from "classnames";
import * as React from "react";

import { Square as SquareEnum } from "../Reversi";

import * as css from "./Square.css";

export enum Dot {
    none,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
};

export interface SquareProps {
    x: number;  // Position
    y: number;  // Position
    value: SquareEnum; // Enum 0, 1, 2
    onClick?: (x: number, y: number) => any;
}

export interface SquareStates {
    flip: boolean;
    isNew: boolean;
    dot: Dot;
}

export class Square extends React.PureComponent<SquareProps, SquareStates> {
    public state = { flip: false, isNew: false, dot: Dot.none };

    public componentWillReceiveProps(nextProps: SquareProps) {
        // true if white=>black | black=>white but blank=>black|white
        const { value } = this.props;
        const flip = !!(value && nextProps.value && value !== nextProps.value);
        const isNew = !!(!value && nextProps.value);
        this.setState({ flip, isNew });
    }

    public render() {
        const cxPiece = [css.piece];
        if (this.props.value) {
            cxPiece.push(this.props.value === SquareEnum.black ? css.black : css.white);
            if (this.state.flip) {
                if (this.props.value === SquareEnum.black) {
                    cxPiece.push(css.swivelToBlack);
                } else {
                    cxPiece.push(css.swivelToWhite);
                }
            } else if  (this.state.isNew) {
                cxPiece.push(css.floatIn);
            }
        }
        const dotStyle = this.getDot();
        return (
            <div className={css.square} onClick={this.handleClick}>
                {dotStyle && <div className={cx(css.dot, dotStyle)} />}
                <div className={cx(cxPiece)} />
            </div>
        );
    }

    private getDot = (): string => {
        const { x, y } = this.props;
        if (y === 1 || y === 5) {
            if (x === 1 || x === 5) { return css.bottomRight; }
            if (x === 2 || x === 6) { return css.bottomLeft; }
        }
        if (y === 2 || y === 6) {
            if (x === 1 || x === 5) { return css.topRight; }
            if (x === 2 || x === 6) { return css.topLeft; }
        }
        return "";
    }

    private handleClick = (): void => {
        if (typeof this.props.onClick === "function") {
            this.props.onClick(this.props.x, this.props.y);
        }
    }
}

export default Square;
