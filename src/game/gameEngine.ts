import { Board, GameState, Tetromino, BOARD_WIDTH, BOARD_HEIGHT, Position } from '../types/game';
import { createTetromino, getRandomTetrominoType, rotateTetromino } from './tetrominoes';

// Create an empty board
export const createEmptyBoard = (): Board => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
};

// Initial game state
export const createInitialGameState = (): GameState => ({
  board: createEmptyBoard(),
  currentPiece: createTetromino(getRandomTetrominoType()),
  nextPiece: createTetromino(getRandomTetrominoType()),
  score: 0,
  level: 1,
  lines: 0,
  isGameOver: false,
  isPaused: false,
});

// Check if a position is valid for a tetromino
export const isValidPosition = (
  board: Board,
  tetromino: Tetromino,
  position: Position = tetromino.position
): boolean => {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const newX = position.x + x;
        const newY = position.y + y;

        // Check boundaries
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }

        // Check collision with existing pieces (but not if we're at the top)
        if (newY >= 0 && board[newY][newX] !== null) {
          return false;
        }
      }
    }
  }
  return true;
};

// Move tetromino down
export const moveTetrominoDown = (gameState: GameState): GameState => {
  if (!gameState.currentPiece) return gameState;

  const newPosition = {
    x: gameState.currentPiece.position.x,
    y: gameState.currentPiece.position.y + 1,
  };

  if (isValidPosition(gameState.board, gameState.currentPiece, newPosition)) {
    return {
      ...gameState,
      currentPiece: {
        ...gameState.currentPiece,
        position: newPosition,
      },
    };
  }

  // Can't move down, lock the piece
  return lockPiece(gameState);
};

// Move tetromino horizontally
export const moveTetrominoHorizontal = (gameState: GameState, direction: -1 | 1): GameState => {
  if (!gameState.currentPiece) return gameState;

  const newPosition = {
    x: gameState.currentPiece.position.x + direction,
    y: gameState.currentPiece.position.y,
  };

  if (isValidPosition(gameState.board, gameState.currentPiece, newPosition)) {
    return {
      ...gameState,
      currentPiece: {
        ...gameState.currentPiece,
        position: newPosition,
      },
    };
  }

  return gameState;
};

// Rotate tetromino
export const rotateCurrentTetromino = (gameState: GameState): GameState => {
  if (!gameState.currentPiece) return gameState;

  const rotatedShape = rotateTetromino(gameState.currentPiece);
  const rotatedTetromino = {
    ...gameState.currentPiece,
    shape: rotatedShape,
  };

  if (isValidPosition(gameState.board, rotatedTetromino)) {
    return {
      ...gameState,
      currentPiece: rotatedTetromino,
    };
  }

  return gameState;
};

// Lock current piece to the board and spawn new piece
export const lockPiece = (gameState: GameState): GameState => {
  if (!gameState.currentPiece) return gameState;

  // Add current piece to board
  const newBoard = gameState.board.map(row => [...row]);
  
  for (let y = 0; y < gameState.currentPiece.shape.length; y++) {
    for (let x = 0; x < gameState.currentPiece.shape[y].length; x++) {
      if (gameState.currentPiece.shape[y][x]) {
        const boardX = gameState.currentPiece.position.x + x;
        const boardY = gameState.currentPiece.position.y + y;
        
        if (boardY >= 0) {
          newBoard[boardY][boardX] = gameState.currentPiece.type;
        }
      }
    }
  }

  // Check for complete lines
  const { clearedBoard, linesCleared } = clearCompleteLines(newBoard);
  
  // Calculate new score
  const linePoints = [0, 40, 100, 300, 1200];
  const points = linePoints[linesCleared] * gameState.level;
  const newScore = gameState.score + points;
  const newLines = gameState.lines + linesCleared;
  const newLevel = Math.floor(newLines / 10) + 1;

  // Check for game over
  const newCurrentPiece = gameState.nextPiece;
  const isGameOver = newCurrentPiece ? 
    !isValidPosition(clearedBoard, newCurrentPiece, { x: 4, y: 0 }) : true;

  return {
    ...gameState,
    board: clearedBoard,
    currentPiece: isGameOver ? null : newCurrentPiece,
    nextPiece: isGameOver ? null : createTetromino(getRandomTetrominoType()),
    score: newScore,
    level: newLevel,
    lines: newLines,
    isGameOver,
  };
};

// Clear complete lines from the board
export const clearCompleteLines = (board: Board): { clearedBoard: Board; linesCleared: number } => {
  const completeLines: number[] = [];
  
  // Find complete lines
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (board[y].every(cell => cell !== null)) {
      completeLines.push(y);
    }
  }

  if (completeLines.length === 0) {
    return { clearedBoard: board, linesCleared: 0 };
  }

  // Remove complete lines and add new empty lines at the top
  const newBoard = board.filter((_, index) => !completeLines.includes(index));
  const emptyLines = Array(completeLines.length).fill(null)
    .map(() => Array(BOARD_WIDTH).fill(null));
  
  return {
    clearedBoard: [...emptyLines, ...newBoard],
    linesCleared: completeLines.length,
  };
};

// Drop tetromino to the bottom
export const dropTetromino = (gameState: GameState): GameState => {
  if (!gameState.currentPiece) return gameState;

  let newGameState = gameState;
  
  // Keep moving down until we can't
  while (newGameState.currentPiece && 
         isValidPosition(newGameState.board, newGameState.currentPiece, {
           x: newGameState.currentPiece.position.x,
           y: newGameState.currentPiece.position.y + 1,
         })) {
    newGameState = moveTetrominoDown(newGameState);
  }
  
  // Lock the piece
  return lockPiece(newGameState);
};

// Get the drop position (for ghost piece)
export const getDropPosition = (gameState: GameState): Position | null => {
  if (!gameState.currentPiece) return null;

  let dropY = gameState.currentPiece.position.y;
  
  while (isValidPosition(gameState.board, gameState.currentPiece, {
    x: gameState.currentPiece.position.x,
    y: dropY + 1,
  })) {
    dropY++;
  }

  return { x: gameState.currentPiece.position.x, y: dropY };
};
