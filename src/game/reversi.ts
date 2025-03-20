/**
 * Maximum number of turns in a Reversi game
 * Traditional Reversi has 60 turns (8×8 board minus 4 initial pieces)
 */
const MAX_TURN_COUNT = 60;

import computeNextMove from "./solver";

/**
 * Represents a possible move on the board
 */
export interface Move {
    x: number;
    y: number;
}

/**
 * Enum representing the two players in Reversi
 */
export enum Player {
    black = 1,
    white = 2,
}

/**
 * Enum representing the possible states of a square on the board
 * guard: virtual border for edge detection
 * blank: empty square
 * black/white: occupied by respective player
 */
export enum Square {
    guard = -1,
    blank = 0,
    black = 1,
    white = 2,
}

export type UpdateHandler = () => void;

/**
 * Game status enum
 */
export enum GameStatus {
    inProgress = 'inProgress',
    blackWins = 'blackWins',
    whiteWins = 'whiteWins',
    draw = 'draw',
    finished = 'finished'
}

/**
 * Reversi game engine
 * Handles the game state, rules, and mechanics
 */
export class Reversi {
    /**
     * Initializes the game board with a standard Reversi setup
     * Creates a 10×10 board with guard cells and the initial 4 pieces in the center
     * @returns A 2D array representing the initial board state
     */
    public static initBoard = (): Square[][] => {
        // Create a 10×10 board with guard cells (for easier edge detection)
        const board = [];
        for (let y = 0; y < 10; y++) {
            board[y] = [] as Square[];
            for (let x = 0; x < 10; x++) {
                board[y].push(Square.guard);
            }
        }

        // Set the inner 8×8 to be blank squares
        for (let y = 1; y < 9; y++) {
            for (let x = 1; x < 9; x++) {
                board[y][x] = Square.blank;
            }
        }

        // Set the initial 4 pieces in the center
        board[4][4] = Square.white;
        board[5][5] = Square.white;
        board[5][4] = Square.black;
        board[4][5] = Square.black;
        return board;
    };

    /** Current board state, 10×10 with guard cells on the border */
    public board: Square[][] = [];

    /** The human player's color */
    public player: Player = Player.black;

    /** Current player's turn */
    public turn: Player = Player.black;

    /** Current turn number */
    public turnCount = 1;

    /** Whether AI is calculating its move */
    public thinking = false;

    /** AI difficulty level (0-4) */
    public aiLevel = 3;

    /** Current game status */
    public gameStatus: GameStatus = GameStatus.inProgress;

    public cb: UpdateHandler | null = null;

    /**
     * Creates a new Reversi game
     * @param player - The human player's color (default: black)
     * @param aiLevel - AI difficulty level (default: 3)
     */
    constructor(player: Player = Player.black, aiLevel = 3, cb: UpdateHandler | null = null) {
        this.init(player, aiLevel);
        this.cb = cb;
    }

    /**
     * Gets the actual 8×8 game board without guard cells
     * @returns 8×8 array representing the playable board
     */
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

    /**
     * Gets the winner of the game
     * @returns The winner player or undefined if no winner yet
     */
    get winner(): GameStatus {
        return this.gameStatus;
    }

    /**
     * Determines if the game is finished by checking turn count and possible moves
     * @returns true if game is finished, false otherwise
     */
    get finished(): boolean {
        return this.gameStatus !== GameStatus.inProgress;
    }

    /**
     * Calculates current score by counting pieces of each color
     * @returns Object with black and white piece counts
     */
    get score(): { black: number; white: number } {
        // Count all black pieces on the board
        const black = this.value
            .reduce((res, val) => res.concat(val), [])
            .filter(v => v === Square.black).length;

        // Count all white pieces on the board
        const white = this.value
            .reduce((res, val) => res.concat(val), [])
            .filter(v => v === Square.white).length;

        return { black, white };
    }

    /**
     * Creates a deep copy of another Reversi game state
     * @param game - Game to copy from
     * @returns this instance with copied state
     */
    public copy(game: Reversi): Reversi {
        // Deep copy the board
        this.board = game.board.map(y => [...y]);
        this.player = game.player;
        this.turn = game.turn;
        this.turnCount = game.turnCount;
        this.aiLevel = game.aiLevel;
        this.thinking = game.thinking;
        this.gameStatus = game.gameStatus;
        return this;
    }

    /**
     * Initializes/resets the game to starting state
     * @param player - The human player's color (default: black)
     * @param aiLevel - AI difficulty level (default: 3)
     */
    public init(player = Player.black, aiLevel = 3): void {
        this.player = player;
        this.board = Reversi.initBoard();
        this.turn = Player.black;
        this.turnCount = 1;
        this.aiLevel = aiLevel;
        this.thinking = false;
        this.gameStatus = GameStatus.inProgress;
    }

    /**
     * Places a stone on the board and flips opponent's stones accordingly
     * @param x - 0-based x-coordinate
     * @param y - 0-based y-coordinate
     * @param player - Player making the move (default: current turn)
     * @param tickTurn - Whether to advance to next turn after move (default: true)
     * @returns Array of all changes made to the board
     */
    public placeStone(x: number, y: number, player: Player = this.turn, tickTurn = true): { x: number, y: number, prev: Square }[] {
        // Convert to 1-based coordinates for the internal board (accounting for guard cells)
        const _x = x + 1;
        const _y = y + 1;

        // Verify the move is valid
        if (!this.canPlaceStone(_x, _y, player)) {
            return [];
        }

        // Track all changes to enable undo
        const changes: { x: number, y: number, prev: Square }[] = [];

        // Check in all 8 directions
        for (let yd = -1; yd <= 1; yd++) {
            for (let xd = -1; xd <= 1; xd++) {
                // Skip the center (dx=0, dy=0)
                if (yd === 0 && xd === 0) continue;

                // Count stones that can be flipped in this direction
                const count = this.countTurnableStones(_x, _y, xd, yd, player);

                // Flip the stones in this direction
                for (let cur = 1; cur <= count; cur++) {
                    const cx = _x + cur * xd;
                    const cy = _y + cur * yd;
                    changes.push({ x: cx, y: cy, prev: this.board[cy][cx] });
                    this.board[cy][cx] = player as number;
                }
            }
        }

        // Place the player's stone
        changes.push({ x: _x, y: _y, prev: this.board[_y][_x] });
        this.board[_y][_x] = player as number;

        // Move to next turn if requested
        if (tickTurn) {
            this.tickTurn();
        }

        return changes;
    }

    /**
     * Undoes a move by restoring previous board state
     * @param changes - Array of changes to undo
     */
    public undoMove(changes: { x: number, y: number, prev: Square }[]): void {
        for (const change of changes) {
            this.board[change.y][change.x] = change.prev;
        }
    }

    /**
     * Gets all valid moves for the current player
     * @param player - Player to check moves for (default: current turn)
     * @returns Array of valid moves
     */
    public possibleMoves(player: Player = this.turn): Move[] {
        const ret: Move[] = [];

        // Check each square on the board
        for (let y = 1; y < 9; y++) {
            for (let x = 1; x < 9; x++) {
                // A move is possible if the square is empty and placing a stone would flip some opponent's stones
                if (this.board[y][x] === Square.blank && this.canPlaceStone(x, y, player)) {
                    ret.push({ x, y });
                }
            }
        }

        return ret;
    }

    /**
     * Counts how many stones would be turned in a specific direction
     * @param x - x-coordinate (1-based)
     * @param y - y-coordinate (1-based)
     * @param xd - x-direction (-1, 0, or 1)
     * @param yd - y-direction (-1, 0, or 1)
     * @param player - Player making the move
     * @returns Number of stones that would be flipped
     */
    public countTurnableStones(
        x: number,
        y: number,
        xd: number,
        yd: number,
        player: Player = this.turn
    ): number {
        // Helper to get board value at a position relative to (x,y)
        const getValueAt = (c: number) => this.board[y + c * yd][x + c * xd] as number;
        const opponent = 3 - player;

        // Move in the specified direction until we find a non-opponent piece
        let cursor = 1;
        while (getValueAt(cursor) === opponent) {
            cursor++;
        }

        // If we found our own piece, all opponent pieces in between can be flipped
        return getValueAt(cursor) === player ? cursor - 1 : 0;
    }

    /**
     * Checks if a move is valid
     * @param x - x-coordinate (1-based)
     * @param y - y-coordinate (1-based)
     * @param player - Player making the move
     * @returns true if the move is valid, false otherwise
     */
    public canPlaceStone(x?: number, y?: number, player: Player = this.turn): boolean {
        // If no coordinates provided, check if any valid move exists
        if (typeof x === "undefined" && typeof y === "undefined") {
            return this.canPlaceStoneAnywhere(player);
        }

        // Check coordinates are in bounds
        if (!(x && y) || x < 1 || x > 8 || y < 1 || y > 9) {
            return false;
        }

        // Check square is empty
        if (this.board[y][x] !== Square.blank) {
            return false;
        }

        // Check if placing a stone would flip any opponent stones
        for (let yd = -1; yd <= 1; yd++) {
            for (let xd = -1; xd <= 1; xd++) {
                if (this.countTurnableStones(x, y, xd, yd, player)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Checks if the player has any valid moves
     * @param player - Player to check for
     * @returns true if any valid move exists, false otherwise
     */
    private canPlaceStoneAnywhere(player: Player = this.turn): boolean {
        return !!this.possibleMoves(player).length;
    }

    /**
     * Advances to the next turn
     * If the next player has no valid moves, skips their turn
     * If it's the AI's turn, triggers AI move calculation
     * @param cb - Callback function to execute after turn completes
     */
    private tickTurn(cb?: () => void): void {
        // Check if game is over due to turn count
        if (this.turnCount >= MAX_TURN_COUNT) {
            this.finishGame();
            return;
        }

        // Switch to the other player
        this.turn = 3 - this.turn as Player;
        this.turnCount += 1;

        // If current player has no valid moves
        if (!this.canPlaceStoneAnywhere(this.turn)) {
            // Check if the other player also has no valid moves
            if (!this.canPlaceStoneAnywhere(3 - this.turn as Player)) {
                // Game is over if neither player can move
                this.finishGame();
                return;
            }
            // Skip turn if only current player has no moves
            this.tickTurn(cb);
            return;
        }

        // If it's AI's turn, trigger AI move calculation
        if (this.turn !== this.player) {
            this.thinking = true;
            const startTime = Date.now();

            // Use setTimeout for non-blocking AI calculation
            setTimeout(() => {
                computeNextMove(this, () => {
                    // Add a small delay to make AI moves more visible to player
                    const elapsedTime = Date.now() - startTime;
                    const remainingTime = Math.max(0, 50 - elapsedTime);
                    setTimeout(() => {
                        this.thinking = false;
                        if (typeof cb === "function") {
                            cb();
                        }
                    }, remainingTime);
                }, this.aiLevel);
            }, 100);
        }
    }

    /**
     * Handles game end
     */
    private finishGame(): void {
        const { black, white } = this.score;

        if (black > white) {
            this.gameStatus = GameStatus.blackWins;
        } else if (white > black) {
            this.gameStatus = GameStatus.whiteWins;
        } else {
            this.gameStatus = GameStatus.draw;
        }
    }
}

export default Reversi;