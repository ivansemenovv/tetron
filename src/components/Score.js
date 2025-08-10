import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Score = ({ score, lines, level, highScore }) => {
  return (
    <View style={styles.container}>
      <View style={styles.scoreItem}>
        <Text style={styles.label}>SCORE</Text>
        <Text style={styles.value}>{score.toLocaleString()}</Text>
      </View>

      <View style={styles.scoreItem}>
        <Text style={styles.label}>HIGH</Text>
        <Text style={styles.value}>{highScore.toLocaleString()}</Text>
      </View>

      <View style={styles.scoreItem}>
        <Text style={styles.label}>LINES</Text>
        <Text style={styles.value}>{lines}</Text>
      </View>

      <View style={styles.scoreItem}>
        <Text style={styles.label}>LEVEL</Text>
        <Text style={styles.value}>{level}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2c3e50',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
  },
  scoreItem: {
    marginBottom: 10,
  },
  label: {
    color: '#95a5a6',
    fontSize: 12,
    fontWeight: 'bold',
  },
  value: {
    color: '#ecf0f1',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Score;