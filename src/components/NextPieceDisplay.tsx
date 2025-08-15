import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { Tetromino } from '../types/game';
import { TETROMINO_COLORS } from '../game/tetrominoes';

interface NextPieceDisplayProps {
  nextPiece: Tetromino | null;
}

const NextPieceDisplay: React.FC<NextPieceDisplayProps> = ({ nextPiece }) => {
  if (!nextPiece) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>NEXT</Text>
        <View style={styles.preview}>
          <Text style={styles.emptyText}>-</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NEXT</Text>
      <View style={styles.preview}>
        {nextPiece.shape.map((row, y) => (
          <View key={y} style={styles.row}>
            {row.map((cell, x) => (
              <View
                key={x}
                style={[
                  styles.cell,
                  {
                    backgroundColor: cell 
                      ? nextPiece.color
                      : 'transparent',
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
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  title: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  preview: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    minWidth: 60,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 12,
    height: 12,
    borderWidth: 0.5,
    borderColor: '#444',
  },
  emptyText: {
    color: '#666',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default NextPieceDisplay;
