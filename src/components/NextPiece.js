import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NextPiece = ({ piece }) => {
  const renderPiece = () => {
    if (!piece) return null;

    return piece.shape.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, colIndex) => (
          <View
            key={`${rowIndex}-${colIndex}`}
            style={[
              styles.cell,
              cell ? { backgroundColor: piece.color } : styles.emptyCell
            ]}
          />
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>NEXT</Text>
      <View style={styles.pieceContainer}>
        {renderPiece()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    color: '#ecf0f1',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pieceContainer: {
    backgroundColor: '#0c0c0c',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#34495e',
    minWidth: 80,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  emptyCell: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
});

export default NextPiece;