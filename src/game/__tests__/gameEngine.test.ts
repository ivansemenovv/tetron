import {
  createEmptyBoard,
  createInitialGameState,
  isValidPosition,
  moveTetrominoDown,
  moveTetrominoHorizontal,
  rotateCurrentTetromino,
  clearCompleteLines,
} from '../gameEngine';
import { createTetromino } from '../tetrominoes';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../../types/game';

describe('GameEngine', () => {
  describe('createEmptyBoard', () => {
    it('should create a board with correct dimensions', () => {
      const board = createEmptyBoard();
      expect(board).toHaveLength(BOARD_HEIGHT);
      expect(board[0]).toHaveLength(BOARD_WIDTH);
      
      // All cells should be null
      board.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBeNull();
        });
      });
    });
  });

  describe('createInitialGameState', () => {
    it('should create initial game state with correct properties', () => {
      const gameState = createInitialGameState();
      
      expect(gameState.board).toHaveLength(BOARD_HEIGHT);
      expect(gameState.currentPiece).not.toBeNull();
      expect(gameState.nextPiece).not.toBeNull();
      expect(gameState.score).toBe(0);
      expect(gameState.level).toBe(1);
      expect(gameState.lines).toBe(0);
      expect(gameState.isGameOver).toBe(false);
      expect(gameState.isPaused).toBe(false);
    });
  });

  describe('isValidPosition', () => {
    it('should return true for valid positions', () => {
      const board = createEmptyBoard();
      const tetromino = createTetromino('I');
      
      expect(isValidPosition(board, tetromino)).toBe(true);
    });

    it('should return false for positions outside board boundaries', () => {
      const board = createEmptyBoard();
      const tetromino = createTetromino('I');
      
      // Test left boundary
      tetromino.position = { x: -1, y: 0 };
      expect(isValidPosition(board, tetromino)).toBe(false);
      
      // Test right boundary
      tetromino.position = { x: BOARD_WIDTH, y: 0 };
      expect(isValidPosition(board, tetromino)).toBe(false);
      
      // Test bottom boundary
      tetromino.position = { x: 0, y: BOARD_HEIGHT };
      expect(isValidPosition(board, tetromino)).toBe(false);
    });
  });

  describe('moveTetrominoDown', () => {
    it('should move tetromino down when valid', () => {
      const gameState = createInitialGameState();
      const initialY = gameState.currentPiece!.position.y;
      
      const newGameState = moveTetrominoDown(gameState);
      
      expect(newGameState.currentPiece!.position.y).toBe(initialY + 1);
    });
  });

  describe('moveTetrominoHorizontal', () => {
    it('should move tetromino left when valid', () => {
      const gameState = createInitialGameState();
      const initialX = gameState.currentPiece!.position.x;
      
      const newGameState = moveTetrominoHorizontal(gameState, -1);
      
      expect(newGameState.currentPiece!.position.x).toBe(initialX - 1);
    });

    it('should move tetromino right when valid', () => {
      const gameState = createInitialGameState();
      const initialX = gameState.currentPiece!.position.x;
      
      const newGameState = moveTetrominoHorizontal(gameState, 1);
      
      expect(newGameState.currentPiece!.position.x).toBe(initialX + 1);
    });
  });

  describe('clearCompleteLines', () => {
    it('should clear complete lines', () => {
      const board = createEmptyBoard();
      
      // Fill the bottom row
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[BOARD_HEIGHT - 1][x] = 'I';
      }
      
      const result = clearCompleteLines(board);
      
      expect(result.linesCleared).toBe(1);
      expect(result.clearedBoard[BOARD_HEIGHT - 1].every(cell => cell === null)).toBe(true);
    });

    it('should not clear incomplete lines', () => {
      const board = createEmptyBoard();
      
      // Fill the bottom row except one cell
      for (let x = 0; x < BOARD_WIDTH - 1; x++) {
        board[BOARD_HEIGHT - 1][x] = 'I';
      }
      
      const result = clearCompleteLines(board);
      
      expect(result.linesCleared).toBe(0);
    });
  });
});
