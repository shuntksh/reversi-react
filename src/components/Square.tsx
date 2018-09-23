/* tslint:disable:max-line-length */
import * as React from "react";
import styled, { css, keyframes } from "styled-components";

import { Player, Square as SquareEnum } from "../Reversi";

export enum Dot {
    none,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
}

export interface Props {
    x: number; // Position
    y: number; // Position
    value: SquareEnum; // Enum 0, 1, 2
    canPlace: boolean;
    hoveringColor?: Player;
    onClick?: (x: number, y: number) => any;
    placeable?: SquareEnum;
}

export interface State {
    flip: boolean;
    isNew: boolean;
    dot: Dot;
}

export class Square extends React.PureComponent<Props, State> {
    public state = { flip: false, isNew: false, dot: Dot.none };

    public componentWillReceiveProps(nextProps: Props) {
        // true if white=>black | black=>white but blank=>black|white
        const { value } = this.props;
        const flip = !!(value && nextProps.value && value !== nextProps.value);
        const isNew = !!(!value && nextProps.value);
        this.setState({ flip, isNew });
    }

    public render() {
        const dotPlacement = this.getDot();
        return (
            <SquareStyled dotPlacement={dotPlacement} onClick={this.handleClick}>
                {(!!this.props.value || !!this.props.placeable) && (
                    <Stone
                        player={this.props.value}
                        floatIn={this.state.isNew}
                        to={this.state.flip ? this.props.value : undefined}
                        placeable={this.props.placeable}
                    />
                )}
            </SquareStyled>
        );
    }

    private getDot = (): Placement => {
        const { x, y } = this.props;
        if (y === 1 || y === 5) {
            if (x === 1 || x === 5) {
                return Placement.bottomRight;
            }
            if (x === 2 || x === 6) {
                return Placement.bottomLeft;
            }
        }
        if (y === 2 || y === 6) {
            if (x === 1 || x === 5) {
                return Placement.topRight;
            }
            if (x === 2 || x === 6) {
                return Placement.topLeft;
            }
        }
        return Placement.none;
    };

    private handleClick = (): void => {
        if (typeof this.props.onClick === "function") {
            this.props.onClick(this.props.x, this.props.y);
        }
    };
}

export default Square;

interface StoneProps {
    player: SquareEnum; // 1: white 2: black
    placeable?: SquareEnum;
    floatIn?: boolean;
    to?: SquareEnum;
}

const Stone = styled.div`
    width: 58px;
    height: 58px;
    background-size: 58px 58px;
    background-repeat: no-repeat;
    backface-visibility: hidden;
    position: absolute;
    border-radius: 100%;
    opacity: ${(props: StoneProps) => (props.placeable ? 0 : 1)};
    top: 7px;
    left: 7px;
    background-image: ${(props: StoneProps) =>
        props.player === SquareEnum.black
            ? "url(data:image/png;base64,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);"
            : "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAABSCAYAAAAVfInDAAAAAXNSR0IArs4c6QAACYVJREFUeAHtnV9oFEccxzebxCSXPyYliaixwWBIQXwoiDREkAo+WQVLofXJBsRK0WofraAWsfqg1AgiqRqVvNjYvniK0qIBUQIR24eoGAMxaaNo/ieXu1ySS6bf73b3vEvucrubu8vd7Q78MvtnZvY3n/vNzG9m/yRNSoAghEifmJiogCqVMzMzS7Gfn5aWlq/GLsQu7LtkWR5Bmo6srKxO7E8vtuppi6EAQH3k8/k2A8Y2gFkHHZYBhhcyBUnHfgbiDMYQH9L41Hga25mQbOy/Q5o2wHZmZGTcB9AXOBbXEDd4Ho+nBpXeg9ptB7QMiJyenu5AJAGC4UqjLAngpOnpaQ9iBgK+ibJ+cTgcjwwXaCKDca0NXAQVLAG0g6jQbkgOLMQBYOlmYEW6LGEC5DQs2oPtccglQDyLa/VFymv2fEzgAVgZFDoEqQUwCZITC2DhKk2QgDgOYZIrkJMA2RMufUIch9K5AFcHcU9OTnqxv+iBelAf6gVlcqMJKmqWB+W+gGL1aJXZS5YscURTyWiUBYgetGovyvoGVvhbNMpcMDz8mkVer/dXKFMNaHkcABI1YFCRAHEM+rVkZ2d/ia5kaCG6LggerG0DLn4LfVpBZmZm1kIUiWfeqampCfSHo7jmZ7DCVrPXNm0mALcfF22GtZUkEziCor7Um/qjHvt4LG4BFzw5Pj4+hmaw6APCQhSg/qgHB5OTZuAZbra4UB0u9G1OTg69/5QImPG4MZj8npubu8tIhQzBc7vd1zAgfIXOdomRiyRDWgx6k9CzEUaxW6++uvs8WNwpuCGfpyI4wmK90AXsMtKEdcFDgfswrO/H5DtP76+SjOnYFaGe37G+evSP2GxREN2RZvwyjnhOsfQoH4s0sD4JTdiDsj+N5MbMa3koqAiFODljsAI4/hisJ+uLzVtq/Xk4ZJgXHn6BJjjAS9HXhcycqgdZXzr+6swpbDXDwkNz5Vz1k2RzgMPW1OAJtd7VKoeQuUP2eTDXXDiP/2CA+CCR56ohaxTFg5wLwwccxEDyIZqze3bRIS0P4H7i6oiVwREU608O5DEbHPfnWB7MlAuZ7aCdcMtKoSoQj2OAx9G3avaCaijLO4TO0lojRIRfQOXBlfGgEGR56OtKQLkbVpcTlMrekcBlHFjK0ff574kEWR6a7EG08SCgNrf/CZAL+QTyCAKFk+8wkyi1ikMcCCLSNlolZx696PeWaWn9lgdwNThomZmEBkBvrBqUQ+WkZPPDA9k96BjtEXYemuRDTloSPzwc2I6TgftaGjtWCah8tmtAFFh8dgREs+y+TsMSOiYfciIvplDg4U7SZhzMDJ3FPhpIgJzIi8cUeJiGbIMPkzL3JAIrG+1tciIvPzzcx/zY6vNYvZDJibwUeDDDdBwosfs7ffjIibwUbuj8KkByRl9WOxUJkBe5sc+rxPMbSt9no9FHQOVVKWPkKLTns/qgaanIi9zk58+fV8D5047bsQ4C5EVu8sDAQDnW63VksZNoBMiL3GSMGkW25WlY9MXkRW7y8PCwQPvVl8tOpRAgr9HRUUnu7+/n0GtjMUCA8AYHB9Nk/rEtzwA5JCUvtFhZxuLekA3PODwMGL3y06dPu+0Bwxg8zm/b29v/lZubmzvxZICx3BZPjfsY0oMHD7pk3FEb7uvrw8grLI5EX/XJCU1WYLQd5Jy2A94yHsuw1wb04COnx48fE1YH4XU6nc40l8ulJ6/l04yNjUn37t3jLdtOwpt++PBhvz3i6rML3LuVnjx5MkBuylLUs2fP/qajbPd78wMkHzbb1tbWv5hSgYfYeefOHR/WqebPbfGzNLDbt29PAaKTKDR49xsaGiY5X7NDeAKYVUg3btzgQsB9pgp8VmWou7u7cNWqVaZeWw9/ydQ4wyb7+vVrqby8fBhNlw+6+y2P2zevXr06Y4+6RDE3sFVeuHAB3GZuzj0rSTUlJSUuOoB2mEuAXFasWEF/jg9EKUHr87jzCDMNT2Njo0Rfxg7vCeCdO6mpqUl68+YNH68N++WME2VlZR6s8c1Fb+EjWLaj1RHcifdIg/s8Hv+5p6dHQt/H9arAdJbdJge2RlgdGZyNBOI83jv1YmQReAfVwvaGzwj5fOLVq1cCqyj8sMP5SOB4nq8SuHfs2CHU1RbLAmT3VV1dzeUmvsBCLroC3+Z2w5sWcF0sCW9oaEicOXNGA0ceugM/3jJQVFQk4Dgr5mslgmyuL1++FHi4nfC4CGD4YzZ8cc+1fv16QfOFc2gJfqwnu6uNGzcSHP06cjAV/kQu7969e4VVnGcaSm1tLcFxkPjDFDU1E+dw7yDi+PHjKQ+Q4I4cOUJwlF6IModFbDpsQE6ONqK+vl6wI03FMDIyotSP9VTry3pHJfCDBQrAixcvKn1gKgGkR3H48GHN4jg35deKohpOoTQFoNaEk30Qof5sqkePHg0EZ+rrPnpINyDROERwEOGFOawnY+DsiaOqOjgQ3gTkGiSmgRfgEC7oxtAPTDZHGmtzit6bNm3SLI5POv0YU2oBhfubMB1pzkT4Kyb6XFiztuvXr4uCggINHLsi1ieuwT+I4KqCc2EuJmAVIuFaMfs2eglYGRE7d+7UoDEmOF1f74kFWQ7n9APpUAqsxojTp08rfWGiNGUs7PoHBayOaOCoL/WOmjuCskwFOpKciSj9IGKxcuVKUVdXpzjV9J/iPSqzeXIBk3L58mWxfPlyDRpj6kl9F+wAo4yoBc4BOYn2QBRli4uLxbFjx5TOube3V+Bue8xA8gdi+W/fvhVdXV3iwIEDorCwMBAamyj1Mz1XRd6YBq4+1EGoqNKUESsV4LoYHWz2Oxxc2AfRzTFrlbQu5qdl02UisHPnzoktW7YIvOIUCI16UB/qZXh1BHnChsD7tmETmTjBhcMfIF+reYO+llFVVSXBTZC2bt0qrV27ViotLeWXc5THVfmgJYWP6zPmXXo+yQBYiuAFEonPE/J2QVtbm9TS0iLdvXuXDxuql/JH9EcZrkDo+PZwJ5ohVvA0HYux8T2EX0MkQL6GP+ebLQSyevVqac2aNRJcCCkvL0/Kz89XYt4v1QRWptxL6OjoUECirNmB/6mA3QbBXYLwnkMfJOlDDWpAB5vfJmanzaYU2LzMbrMclsdyWT6vE5cQa8sLVwm+Zr4Zsg2yDsLPbbBvmoLQMvk+lyY+bGtCy+LrStkQuhptECeEz468gMQ1LBa82ZUksApIJWQpJD9AaFWajGC7A9IJWfR/JvIfVLYz8SL6rwAAAAAASUVORK5CYII=);"};
    &::before {
        content: "";
        background-image: ${(props: StoneProps) =>
            props.player === SquareEnum.black
                ? "url(data:image/png;base64,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);"
                : "url(data:image/png;base64,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);"};
        background-size: 58px 58px;
        background-repeat: no-repeat;
        border-radius: 100%;
        height: 58px;
        left: 0;
        position: absolute;
        top: 0;
        width: 58px;
        transform: translateZ(-5px);
        transition: opacity cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
    }
    ${(props: StoneProps) => {
        if (props.floatIn) {
            return css`
                animation-duration: 0.1s;
                animation-name: ${floatIn};
            `;
        }
        if (props.to) {
            return css`
                animation-fill-mode: forwards;
                animation-duration: 0.8s;
                animation-name: ${props.to === SquareEnum.black ? toBlack : toWhite};
            `;
        }
        if (props.placeable) {
            return css`
                &:hover {
                    opacity: 1;
                }
            `;
        }
        return [];
    }};
`;

enum Placement {
    none = 0,
    topRight,
    topLeft,
    bottomRight,
    bottomLeft,
}

interface SquareProps {
    dotPlacement: Placement;
}

const SquareStyled = styled.div`
    position: relative;
    background: #72ab4d;
    min-width: 72px;
    max-width: 72px;
    min-height: 72px;
    max-height: 72px;
    border: 2px solid #000;
    cursor: default;
    user-select: none;
    display: inline-block;
    margin: 0;
    &::after {
        position: absolute;
        background: black;
        height: 5px;
        width: 5px;
        ${(props: SquareProps) => {
            switch (props.dotPlacement) {
                case Placement.topLeft:
                    return css`
                        content: "";
                        top: -2px;
                        left: -2px;
                        border-bottom-right-radius: 100%;
                    `;
                case Placement.topRight:
                    return css`
                        content: "";
                        top: -2px;
                        right: -2px;
                        border-bottom-left-radius: 100%;
                    `;
                case Placement.bottomLeft:
                    return css`
                        content: "";
                        bottom: -2px;
                        left: -2px;
                        border-top-right-radius: 100%;
                    `;
                case Placement.bottomRight:
                    return css`
                        bottom: -2px;
                        right: -2px;
                        border-top-left-radius: 100%;
                    `;
                default:
                    return [];
            }
        }};
    }
`;

const floatIn = keyframes`
    0% {
        transform: translate3d(0, -8px, 0);
    }

    60% {
        transform: translate3d(0, 0, 0);
    }

    90% {
        transform: translate3d(0, 3px, 0);
    }

    100% {
        transform: translate3d(0, 0, 0) rotateY(90);
    }
`;

const toWhite = keyframes`
    0% {
        transform: rotateY(-180deg) translateY(0);
    }

    10% {
        transform: rotateY(-180deg) translateY(0);
    }

    40% {
        transform: rotateY(180deg) translateY(-50px);
    }

    60% {
        transform: rotateY(340deg) translateY(-50px);
    }

    85% {
        transform: translateY(0);
    }

    100% {
        transform: none;
    }
`;

const toBlack = keyframes`
    0% {
        transform: rotateY(180deg) translateY(0);
    }

    10% {
        transform: rotateY(180deg) translateY(0);
    }

    40% {
        transform: rotateY(-180deg) translateY(-50px);
    }

    60% {
        transform: rotateY(-360deg) translateY(-50px);
    }

    85% {
        transform: translateY(0);
    }

    100% {
        transform: none;
    }
`;
