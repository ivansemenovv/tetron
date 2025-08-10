import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../game/gameLogic';

const { width: screenWidth } = Dimensions.get('window');
const CELL_SIZE = Math.floor((screenWidth - 140) / BOARD_WIDTH);

const GameBoard = ({ board, currentPiece, piecePosition }) => {
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);

    // Merge current piece with board for display
    if (currentPiece && piecePosition) {
      for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
          if (currentPiece.shape[row][col]) {
            const boardY = piecePosition.y + row;
            const boardX = piecePosition.x + col;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }

    return displayBoard.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, colIndex) => (
          <View
            key={`${rowIndex}-${colIndex}`}
            style={[
              styles.cell,
              cell ? { backgroundColor: cell === 1 ? '#888' : cell } : styles.emptyCell
            ]}
          />
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.board}>
      {renderBoard()}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderWidth: 2,
    borderColor: '#34495e',
    backgroundColor: '#0c0c0c',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  emptyCell: {
    backgroundColor: '#111',
  },
});

export default GameBoard;