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
    bottomLight,
};

export interface SquareProps {
    x?: number;  // Position
    y?: number;  // POsition
    dot: Dot; // Enum 0, ... , 4
    value: PieceState; // Enum 0, 1, 2
    onClick?: (ev: React.SyntheticEvent<MouseEvent>, x: number, y: number) => any;
}

export interface SquareStates {
    /**
     * @param toFlip - true: flipping animation, false (defualt): falling animation
     */
    toFlip: boolean;
}

export class Square extends React.PureComponent<SquareProps, SquareStates> {
    public state = { toFlip: false };

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
            } else {
                cxPiece.push(css.floatIn);
            }
        }

        return (
            <div onClick={this.handleClick}>
                <div className={css.square}>
                    <div className={cx(cxPiece)} />
                </div>
            </div>
        );
    }

    private handleClick = (): void => {
        console.log(this.props.value);
    }
}

export default Square;