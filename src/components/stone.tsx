import { useEffect, useState } from "react";
import { Player, Square as SquareEnum } from "../game/reversi";
import "./stone.css";

export enum Dot {
  none,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
}

export interface Props {
  x: number;
  y: number;
  value: SquareEnum;
  canPlace: boolean;
  hoveringColor?: Player;
  onClick?: (x: number, y: number) => void;
}

export const Stone = (props: Props) => {
  const { x, y, value, onClick } = props;
  const [flip, setFlip] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [dot, setDot] = useState(Dot.none);

  useEffect(() => {
    const shouldFlip = !!(
      value !== SquareEnum.blank &&
      value !== undefined
    );
    const shouldBeNew = !!(!value && value !== undefined);
    setFlip(shouldFlip);
    setIsNew(shouldBeNew);

    // Dot placement logic
    const getDotPlacement = () => {
      if (y === 1 || y === 5) {
        if (x === 1 || x === 5) return Dot.bottomRight;
        if (x === 2 || x === 6) return Dot.bottomLeft;
      }
      if (y === 2 || y === 6) {
        if (x === 1 || x === 5) return Dot.topRight;
        if (x === 2 || x === 6) return Dot.topLeft;
      }
      return Dot.none;
    };
    setDot(getDotPlacement());
  }, [x, y, value]);

  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick(x, y);
    }
  };

  const getStoneStyle = () => {
    if (isNew) {
      return { animation: "floatIn 0.1s" };
    }
    if (flip) {
      return {
        animation: `${
          value === SquareEnum.black ? "toBlack" : "toWhite"
        } 0.8s forwards`,
      };
    }
    return {};
  };

  return (
    <div
      className={`square ${dot !== Dot.none ? `dot-${dot}` : ""}`}
      onClick={handleClick}
    >
      {value !== SquareEnum.blank && (
        <div
          className={`stone ${value === SquareEnum.black ? "black" : "white"}`}
          style={getStoneStyle()}
        />
      )}
    </div>
  );
};

