const MAX_TURN_COUNT = 60;

import computeNextMove from "./solver";

export interface Move {
    x: number;
    y: number;
}

export enum Player {
    black = 1,
    white = 2,
}

export enum Square {
    guard = -1,
    blank = 0,
    black = 1,
    white = 2,
}

export class Reversi {
    public static initBoard = (): Square[][] => {
        const board = [];
        for (let y = 0; y < 10; y++) {
            board[y] = [] as Square[];
            for (let x = 0; x < 10; x++) {
                board[y].push(Square.guard);
            }
        }
        for (let y = 1; y < 9; y++) {
            for (let x = 1; x < 9; x++) {
                board[y][x] = Square.blank;
            }
        }
        board[4][4] = Square.white;
        board[5][5] = Square.white;
        board[5][4] = Square.black;
        board[4][5] = Square.black;
        return board;
    };

    public board: Square[][] = [];
    public player: Player = Player.black;
    public turn: Player = Player.black;
    public turnCount = 1;
    public thinking = false;
    public aiLevel = 3;

    constructor(player: Player = Player.black, aiLevel = 3) {
        this.init(player, aiLevel);
    }

    get value(): Square[][] {
        const ret = [];
        for (let y = 1; y < 9; y++) {
            const row = [];
            for (let x = 1; x < 9; x++) {
                row.push(this.board[y][x]);
            }
            ret.push(row);
        }
        return ret;
    }

    get finished(): boolean {
        return this.turnCount >= MAX_TURN_COUNT;
    }

    get score(): { black: number; white: number } {
        const black = this.value
            .reduce((res, val) => res.concat(val), [])
            .filter(v => v === Square.black).length;
        const white = this.value
            .reduce((res, val) => res.concat(val), [])
            .filter(v => v === Square.white).length;
        return { black, white };
    }

    public copy(game: Reversi): Reversi {
        this.board = game.board.map(y => [...y]);
        this.player = game.player;
        this.turn = game.turn;
        this.turnCount = game.turnCount;
        this.aiLevel = game.aiLevel;
        this.thinking = game.thinking;
        return this;
    }

    public init(player = Player.black, aiLevel = 3): void {
        this.board = Reversi.initBoard();
        this.turn = Player.black;
        this.turnCount = 1;
        this.aiLevel = aiLevel;
        this.thinking = false;
    }

    public placeStone(x: number, y: number, player: Player = this.turn, tickTurn = true): { x: number, y: number, prev: Square }[] {
        const _x = x + 1;
        const _y = y + 1;
        if (!this.canPlaceStone(_x, _y, player)) {
            return [];
        }
        const changes: { x: number, y: number, prev: Square }[] = [];
        for (let yd = -1; yd <= 1; yd++) {
            for (let xd = -1; xd <= 1; xd++) {
                if (yd === 0 && xd === 0) continue;
                const count = this.countTurnableStones(_x, _y, xd, yd, player);
                for (let cur = 1; cur <= count; cur++) {
                    const cx = _x + cur * xd;
                    const cy = _y + cur * yd;
                    changes.push({ x: cx, y: cy, prev: this.board[cy][cx] });
                    this.board[cy][cx] = player as number;
                }
            }
        }
        changes.push({ x: _x, y: _y, prev: this.board[_y][_x] });
        this.board[_y][_x] = player as number;
        if (tickTurn) {
            this.tickTurn();
        }
        return changes;
    }

    public undoMove(changes: { x: number, y: number, prev: Square }[]): void {
        for (const change of changes) {
            this.board[change.y][change.x] = change.prev;
        }
    }

    public possibleMoves(player: Player = this.turn): Move[] {
        const ret: Move[] = [];
        for (let y = 1; y < 9; y++) {
            for (let x = 1; x < 9; x++) {
                if (this.board[y][x] === Square.blank && this.canPlaceStone(x, y, player)) {
                    ret.push({ x, y });
                }
            }
        }
        return ret;
    }

    public countTurnableStones(
        x: number,
        y: number,
        xd: number,
        yd: number,
        player: Player = this.turn
    ): number {
        const getValueAt = (c: number) => this.board[y + c * yd][x + c * xd] as number;
        const opponent = 3 - player;
        let cursor = 1;
        while (getValueAt(cursor) === opponent) {
            cursor++;
        }
        return getValueAt(cursor) === player ? cursor - 1 : 0;
    }

    public canPlaceStone(x?: number, y?: number, player: Player = this.turn): boolean {
        if (typeof x === "undefined" && typeof y === "undefined") {
            return this.canPlaceStoneAnywhere(player);
        }
        if (!(x && y) || x < 1 || x > 8 || y < 1 || y > 9) {
            return false;
        }
        if (this.board[y][x] !== Square.blank) {
            return false;
        }
        for (let yd = -1; yd <= 1; yd++) {
            for (let xd = -1; xd <= 1; xd++) {
                if (this.countTurnableStones(x, y, xd, yd, player)) {
                    return true;
                }
            }
        }
        return false;
    }

    private canPlaceStoneAnywhere(player: Player = this.turn): boolean {
        return !!this.possibleMoves(player).length;
    }

    private tickTurn(cb?: () => void): void {
        if (this.turnCount >= MAX_TURN_COUNT) {
            this.finishGame();
            return;
        }
        this.turn = 3 - this.turn;
        this.turnCount += 1;
        if (!this.canPlaceStoneAnywhere(this.turn)) {
            this.tickTurn(cb);
            return;
        }
        if (this.turn !== this.player) {
            this.thinking = true;
            const startTime = Date.now();
            setTimeout(() => {
                computeNextMove(this, () => {
                    const elapsedTime = Date.now() - startTime;
                    const remainingTime = Math.max(0, 50 - elapsedTime);
                    setTimeout(() => {
                        this.thinking = false;
                        if (typeof cb === "function") {
                            cb();
                        }
                    }, remainingTime);
                }, this.aiLevel);
            }, 0);
        }
    }

    private finishGame(): void {
        console.log("DONE");
    }
}

export default Reversi;