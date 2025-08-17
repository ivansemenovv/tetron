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
    alignItems: 'center',
  },
  label: {
    color: '#ecf0f1',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
    opacity: 0.8,
  },
  pieceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 10,
    height: 10,
    borderWidth: 0.5,
    borderColor: '#1a1a1a',
  },
  emptyCell: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
});

export default NextPiece;