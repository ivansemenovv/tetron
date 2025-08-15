import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface GameStatsProps {
  score: number;
  level: number;
  lines: number;
}

const GameStats: React.FC<GameStatsProps> = ({ score, level, lines }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statRow}>
        <Text style={styles.label}>SCORE</Text>
        <Text style={styles.value}>{score.toLocaleString()}</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.label}>LEVEL</Text>
        <Text style={styles.value}>{level}</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.label}>LINES</Text>
        <Text style={styles.value}>{lines}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  statRow: {
    marginBottom: 10,
  },
  label: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  value: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameStats;
