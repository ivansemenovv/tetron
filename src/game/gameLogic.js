export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const createEmptyGrid = () => {
  return Array(BOARD_HEIGHT).fill(null).map(() =>
    Array(BOARD_WIDTH).fill(0)
  );
};

export const createPiece = () => {
  const pieces = 'ILJOTSZ';
  const randPiece = pieces[Math.floor(Math.random() * pieces.length)];
  return {
    type: randPiece,
    shape: getShape(randPiece),
    color: getColor(randPiece)
  };
};

const getShape = (type) => {
  const shapes = {
    'I': [[1, 1, 1, 1]],
    'L': [
      [0, 0, 1],
      [1, 1, 1]
    ],
    'J': [
      [1, 0, 0],
      [1, 1, 1]
    ],
    'O': [
      [1, 1],
      [1, 1]
    ],
    'T': [
      [0, 1, 0],
      [1, 1, 1]
    ],
    'S': [
      [0, 1, 1],
      [1, 1, 0]
    ],
    'Z': [
      [1, 1, 0],
      [0, 1, 1]
    ]
  };
  return shapes[type];
};

const getColor = (type) => {
  const colors = {
    'I': '#00f0f0', // Cyan
    'L': '#f0a000', // Orange
    'J': '#0000f0', // Blue
    'O': '#f0f000', // Yellow
    'T': '#a000f0', // Purple
    'S': '#00f000', // Green
    'Z': '#f00000'  // Red
  };
  return colors[type];
};

export const isValidMove = (board, piece, x, y) => {
  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      if (piece[row][col]) {
        const newX = x + col;
        const newY = y + row;

        // Check boundaries
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }

        // Check collision with existing pieces
        if (newY >= 0 && board[newY][newX]) {
          return false;
        }
      }
    }
  }
  return true;
};

export const rotatePiece = (piece) => {
  // Transpose and reverse to rotate 90 degrees clockwise
  const rows = piece.length;
  const cols = piece[0].length;
  const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      rotated[col][rows - 1 - row] = piece[row][col];
    }
  }

  return rotated;
};

export const mergePiece = (board, piece, x, y) => {
  const newBoard = board.map(row => [...row]);

  for (let row = 0; row < piece.length; row++) {
    for (let col = 0; col < piece[row].length; col++) {
      if (piece[row][col]) {
        const boardY = y + row;
        const boardX = x + col;
        if (boardY >= 0) {
          newBoard[boardY][boardX] = piece[row][col];
        }
      }
    }
  }

  return newBoard;
};

export const clearLines = (board) => {
  const newBoard = [];
  let linesCleared = 0;

  for (let row = 0; row < BOARD_HEIGHT; row++) {
    if (!board[row].every(cell => cell !== 0)) {
      newBoard.push(board[row]);
    } else {
      linesCleared++;
    }
  }

  // Add empty rows at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }

  return { clearedBoard: newBoard, linesCleared };
};