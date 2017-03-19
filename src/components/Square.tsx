import * as cx from "classnames";
import * as Slider from "rc-slider";
import * as React from "react";

import { SquareState } from "./index";
import * as css from "./Square.css";

import "rc-slider/assets/index.css";

export interface SquareProps {
    x?: number;  // Position
    y?: number;  // POsition
    value: SquareState; // Enum 0, 1, 2
    onClick?: (ev: React.SyntheticEvent<MouseEvent>, x: number, y: number) => any;
}

export class Square extends React.PureComponent<SquareProps, {}> {
    public state = { deg: 0 };

    public updateSlider = (deg: number): void => { this.setState({ deg }); };

    public render() {
        const { value } = this.props;
        const cxSquare = [css.square];
        const cxPiece = [css.piece];
        return (
        <div>
            {value} / {this.state.deg}
            <div className={cx(cxSquare)}>
                <div className={cx(cxPiece)} >
                    <div className={css.head} />
                    <div className={css.tail} />
                </div>
            </div>
            <Slider value={this.state.deg} onChange={this.updateSlider} />
        </div>
        );
    }
}

export default Square;
