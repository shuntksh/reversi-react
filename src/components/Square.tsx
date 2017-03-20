import * as cx from "classnames";
import * as React from "react";

import * as css from "./Square.css";

export enum PieceState {
    BLANK,
    BLACK,
    WHITE,
};

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
    value: PieceState; // Enum 0, 1, 2
    onClick?: (x: number, y: number) => any;
}

export interface SquareStates {
    /**
     * @param toFlip - true: flipping animation, false (defualt): falling animation
     */
    toFlip: boolean;
    dot: Dot;
}

export class Square extends React.PureComponent<SquareProps, SquareStates> {
    public state = { toFlip: false, dot: Dot.none };

    public componentWillReceiveProps(nextProps: SquareProps) {
        // true if white=>black | black=>white but blank=>black|white
        const { value } = this.props;
        const toFlip = !!(value && nextProps.value && value !== nextProps.value);
        this.setState({ toFlip });
    }

    public render() {
        const cxPiece = [css.piece];
        if (this.props.value) {
            cxPiece.push(this.props.value === PieceState.BLACK ? css.black : css.white);
            if (this.state.toFlip) {
                if (this.props.value === PieceState.BLACK) {
                    cxPiece.push(css.swivelToBlack);
                } else {
                    cxPiece.push(css.swivelToWhite);
                }
            // } else {
            //     cxPiece.push(css.floatIn);
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
