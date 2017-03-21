
export enum Player {
    black = 1,
    white = 2,
}

export enum Square {
    sentinel = -1,
    blank = 0,
    black = 1,
    white = 2,
}

export interface Reversi {
    board: Square[][];
    player: Player;
    turn: Player;
    turnCount: number;
}

export class Reversi implements Reversi {
    public static initBoard = (): Square[][] => {
        const board = [];
        for (let y = 0; y < 10; y++) {
            board[y] = [] as Square[];
            for (let x = 0; x < 10; x++) {
                board[y].push(Square.sentinel);
            }
        }
        for (let y = 1; y < 9; y++) {
            for (let x = 1; x < 9; x++) {
                board[y][x] = Square.blank;
            }
        }
        board[4][3] = Square.black;
        board[3][3] = Square.black;
        board[3][4] = Square.white;
        board[4][4] = Square.white;
        return board;
    }

    constructor(player: Player = Player.black) {
        this.board = Reversi.initBoard();
        this.player = player;
        this.turn = Player.black;
        this.turnCount = 0;
    }

    /**
     * An accessor method that returns game data without sentinel parts. (10x10 -> 8x8)
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

    /**
     * Reset game
     */
    public reset() {
        this.board = Reversi.initBoard();
    }

    public move(x1: number, y1: number, player: Player = this.turn): boolean {
        if (!this.canPlaceStone(x1, y1, player)) { return false; }
        for (let y2 = -1; y2 <= 1; y2++) {
            for (let x2 = -1; x2 <= 1; x2++) {
                if (y2 === 0 && x2 === 0) { continue; }
                for (let cur = 1; cur <= this.countTurnableStones(x1, y1, x2, y2, player); cur++) {
                    this.board[y1 + cur * y2][x1 + cur * x2] = (player as number);
                }
            }
        }
        this.board[y1][x1] = (player as number);
        return true;
    }

    /**
     * Count tunrnable stones based on position of placement (x1, y1) and vector (x2, y2)
     * and returns a number of stone that can be tuned (for given vector);
     */
    public countTurnableStones(
        x1: number, y1: number, x2: number, y2: number, player: Player = this.turn,
    ): number {
        const getVal = (c: number) => (this.board[y1 + c * y2][x1 + c * x2] as number);
        const opponent = 3 - player;
        // Move cursor till it hits opponent. Otherwise it hits sentinel.
        let cursor = 1;
        while (getVal(cursor) === opponent) { cursor++; }
        return getVal(cursor) === player ? (cursor - 1) : 0;
    }

    /**
     * Check if the current player / computer can place stone to the place.
     * if cordinate is ommited, then it validate if there is any place in the
     * board that current player can place a stone.
     */
    public canPlaceStone(x1?: number, y1?: number, player: Player = this.turn): boolean {
        if (typeof x1 === "undefined" || typeof y1 === "undefined") {
            return this.canPlaceStoneAnywhere(player);
        }

        // Cordinate is outside of board area
        if (x1 < 1 || x1 > 8 || y1 < 1 || y1 > 9) { return false; }

        // Cordinate is not blank
        if (this.board[y1][x1] !== Square.blank) { return false; }

        // Check against all 8 directions
        for (let y2 = -1; y2 <= 1; y2++) {
            for (let x2 = -1; x2 <= 1; x2++) {
                if (this.countTurnableStones(x1, y1, x2, y2, player)) {
                    return true;
                }
            }
        }
        return false;
    }

    private canPlaceStoneAnywhere(player: Player = this.turn): boolean {
        for (let y = 1; y < 9; y++) {
            for (let x = 1; y < 9; x++) {
                if (this.board[y][x] !== Square.blank && this.canPlaceStone(x, y, player)) {
                    return true;
                }
            }
        }
        return false;
    }
}

export default Reversi;
