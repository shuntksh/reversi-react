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

export interface Reversi {
    board: Square[][];
    player: Player;
    turn: Player;
    turnCount: number;
    aiLevel: number;
    thinking: boolean;
}

/**
 * y/x --------------------------->
 *  | -1 -1 -1 -1 -1 -1 -1 -1 -1 -1
 *  | -1  0  0  0  0  0  0  0  0 -1
 *  | -1  0  0  0  0  0  0  0  0 -1
 *  | -1  0  0  0  0  0  0  0  0 -1
 *  | -1  0  0  0  2  1  0  0  0 -1
 *  | -1  0  0  0  1  2  0  0  0 -1
 *  | -1  0  0  0  0  0  0  0  0 -1
 *  | -1  0  0  0  0  0  0  0  0 -1
 *  | -1  0  0  0  0  0  0  0  0 -1
 *  | -1 -1 -1 -1 -1 -1 -1 -1 -1 -1
 *
 *  -1: guard data (a.k.a. sentinel)
 *   0: empty
 *   1: black
 *   2: white
 */
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

    private aiLevel = 3;
    public thinking: boolean = false;

    constructor(player: Player = Player.black, aiLevel: number = 3) {
        this.init(player, aiLevel);
    }

    /**
     * An accessor method that returns game data without sentinel parts. (10x0 -> 8x8)
     */
    get value(): Square[][] {
        // Make sure to return a new Array to avoid unintentional mutation.
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

    /*
     * Deep copying game state
     */
    public copy(game: Reversi): Reversi {
        this.board = game.board.map(y => [...y]);
        this.player = game.player;
        this.turn = game.turn;
        this.turnCount = game.turnCount;
        this.aiLevel = game.aiLevel;
        this.thinking = game.thinking;
        return this;
    }

    /**
     * Reset game
     */
    public init(player = Player.black, aiLevel = 3): void {
        this.board = Reversi.initBoard();
        this.player = player;
        this.turn = Player.black;
        this.turnCount = 1;
        this.aiLevel = aiLevel;
        this.thinking = false;
    }

    /**
     * Function that places a stone into a board and turn that pieces. Return false
     * if the target location is invalid (cannot place stone).
     */
    public placeStone(x: number, y: number, player: Player = this.turn, cb?: () => any): boolean {
        // Convert cordinate back to the original data structure.
        const _x = x + 1;
        const _y = y + 1;
        if (!this.canPlaceStone(_x, _y, player)) {
            return false;
        }
        for (let yd = -1; yd <= 1; yd++) {
            for (let xd = -1; xd <= 1; xd++) {
                if (yd === 0 && xd === 0) {
                    continue;
                }
                const count = this.countTurnableStones(_x, _y, xd, yd, player);
                for (let cur = 1; cur <= count; cur++) {
                    this.board[_y + cur * yd][_x + cur * xd] = player as number;
                }
            }
        }
        this.board[_y][_x] = player as number;

        this.tickTurn(cb);
        return true;
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

    /**
     * Count tunrnable stones based on position of placement (x, y) and vector (xd, yd)
     * and returns a number of stone that can be tuned (for given vector);
     */
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
        // Move cursor till it hits opponent. Otherwise it hits sentinel.
        while (getValueAt(cursor) === opponent) {
            cursor++;
        }
        return getValueAt(cursor) === player ? cursor - 1 : 0;
    }

    /**
     * Check if the current player / computer can place stone to the place.
     * if cordinate is ommited, then it validate if there is any place in the
     * board that current player can place a stone.
     */
    public canPlaceStone(x?: number, y?: number, player: Player = this.turn): boolean {
        if (typeof x === "undefined" && typeof y === "undefined") {
            return this.canPlaceStoneAnywhere(player);
        }

        // Cordinate is outside of board area
        if (!(x && y) || x < 1 || x > 8 || y < 1 || y > 9) {
            return false;
        }

        // Target already has a stone
        if (this.board[y][x] !== Square.blank) {
            return false;
        }

        // Check against all 8 directions
        for (let yd = -1; yd <= 1; yd++) {
            for (let xd = -1; xd <= 1; xd++) {
                if (this.countTurnableStones(x, y, xd, yd, player)) {
                    return true;
                }
            }
        }
        return false;
    }

    // public evalPlacement(x: number, y: number, player: Player): number {
    //     let score = 0;
    //     const _x = x + 1;
    //     const _y = y + 1;
    //     if (!this.canPlaceStone(_x, _y, player)) { return 0; }
    //     for (let yd = -1; yd <= 1; yd++) {
    //         for (let xd = -1; xd <= 1; xd++) {
    //             if (yd === 0 && xd === 0) { continue; }
    //             score += this.countTurnableStones(_x, _y, xd, yd, player);
    //         }
    //     }
    //     return score;
    // }

    private canPlaceStoneAnywhere(player: Player = this.turn): boolean {
        return !!this.possibleMoves(player).length;
    }

    private tickTurn(cb?: () => any): void {
        if (this.turnCount >= MAX_TURN_COUNT) {
            return this.finishGame();
        }
        this.turn = 3 - this.turn;
        this.turnCount += 1;
        if (!this.canPlaceStoneAnywhere(this.turn)) {
            return this.tickTurn(cb);
        }
        if (this.turn !== this.player) {
            // Set thinking state immediately
            this.thinking = true;

            // Ensure AI takes at least 50ms to respond
            const startTime = Date.now();

            setTimeout(() => {
                computeNextMove(this, () => {
                    // Calculate elapsed time
                    const elapsedTime = Date.now() - startTime;

                    // If AI responded too quickly, wait until minimum time has passed
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
