import React from 'react';
import { View, StyleSheet } from 'react-native';

import { GameState, BOARD_WIDTH, BOARD_HEIGHT } from '../types/game';
import { TETROMINO_COLORS } from '../game/tetrominoes';

interface GameBoardProps {
  gameState: GameState;
}

const CELL_SIZE = 20;
const BORDER_WIDTH = 1;

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  // Create display board that includes current piece
  const getDisplayBoard = () => {
    // Start with the static board
    const displayBoard = gameState.board.map(row => [...row]);

    // Add current piece if it exists
    if (gameState.currentPiece) {
      for (let y = 0; y < gameState.currentPiece.shape.length; y++) {
        for (let x = 0; x < gameState.currentPiece.shape[y].length; x++) {
          if (gameState.currentPiece.shape[y][x]) {
            const boardX = gameState.currentPiece.position.x + x;
            const boardY = gameState.currentPiece.position.y + y;
            
            if (boardY >= 0 && boardY < BOARD_HEIGHT && 
                boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = gameState.currentPiece.type;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  const displayBoard = getDisplayBoard();

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {displayBoard.map((row, y) => (
          <View key={y} style={styles.row}>
            {row.map((cell, x) => (
              <View
                key={x}
                style={[
                  styles.cell,
                  {
                    backgroundColor: cell 
                      ? TETROMINO_COLORS[cell]
                      : '#111',
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: BORDER_WIDTH,
    borderColor: '#333',
  },
});

export default GameBoard;
