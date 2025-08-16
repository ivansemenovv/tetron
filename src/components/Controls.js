import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

const Controls = ({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  onPause,
  onNewGame,
  isPaused,
  isGameOver
}) => {
  // On web, only show pause and new game buttons since we have keyboard controls
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.topControls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.pauseButton]}
            onPress={onPause}
            disabled={isGameOver}
          >
            <Text style={styles.buttonText}>{isPaused ? 'RESUME' : 'PAUSE'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.newGameButton]}
            onPress={onNewGame}
          >
            <Text style={styles.buttonText}>NEW GAME</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Mobile controls (unchanged)
  return (
    <View style={styles.container}>
      <View style={styles.topControls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.pauseButton]}
          onPress={onPause}
          disabled={isGameOver}
        >
          <Text style={styles.buttonText}>{isPaused ? 'RESUME' : 'PAUSE'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.newGameButton]}
          onPress={onNewGame}
        >
          <Text style={styles.buttonText}>NEW</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gameControls}>
        <View style={styles.leftControls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.moveButton]}
            onPress={onMoveLeft}
            disabled={isPaused || isGameOver}
          >
            <Text style={styles.buttonText}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.moveButton]}
            onPress={onMoveRight}
            disabled={isPaused || isGameOver}
          >
            <Text style={styles.buttonText}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.centerControls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.rotateButton]}
            onPress={onRotate}
            disabled={isPaused || isGameOver}
          >
            <Text style={styles.buttonText}>↻</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightControls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.dropButton]}
            onPress={onMoveDown}
            disabled={isPaused || isGameOver}
          >
            <Text style={styles.buttonText}>↓</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.hardDropButton]}
            onPress={onHardDrop}
            disabled={isPaused || isGameOver}
          >
            <Text style={styles.buttonText}>⇊</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  gameControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftControls: {
    flexDirection: 'row',
    gap: 10,
  },
  centerControls: {
    alignItems: 'center',
  },
  rightControls: {
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34495e',
  },
  moveButton: {
    backgroundColor: '#3498db',
  },
  dropButton: {
    backgroundColor: '#e67e22',
  },
  hardDropButton: {
    backgroundColor: '#e74c3c',
  },
  rotateButton: {
    backgroundColor: '#9b59b6',
    width: 70,
    height: 70,
  },
  pauseButton: {
    backgroundColor: '#f39c12',
    width: Platform.OS === 'web' ? 120 : 80,
    height: 40,
  },
  newGameButton: {
    backgroundColor: '#27ae60',
    width: Platform.OS === 'web' ? 120 : 80,
    height: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: Platform.OS === 'web' ? 18 : 24,
    fontWeight: 'bold',
  },
});

export default Controls;