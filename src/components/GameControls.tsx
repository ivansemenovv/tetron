import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';

interface GameControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onDrop: () => void;
  onMoveDown: () => void;
  onRestart: () => void;
  disabled?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const BUTTON_SIZE = Math.min(screenWidth / 6, 60);

const GameControls: React.FC<GameControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onDrop,
  onMoveDown,
  onRestart,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Top row - Rotate and Drop */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={[styles.button, styles.rotateButton]}
          onPress={onRotate}
          disabled={disabled}
        >
          <Text style={styles.buttonText}>↻</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.dropButton]}
          onPress={onDrop}
          disabled={disabled}
        >
          <Text style={styles.buttonText}>⬇</Text>
        </TouchableOpacity>
      </View>

      {/* Middle row - Movement */}
      <View style={styles.middleRow}>
        <TouchableOpacity
          style={[styles.button, styles.moveButton]}
          onPress={onMoveLeft}
          disabled={disabled}
        >
          <Text style={styles.buttonText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.downButton]}
          onPress={onMoveDown}
          disabled={disabled}
        >
          <Text style={styles.buttonText}>↓</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.moveButton]}
          onPress={onMoveRight}
          disabled={disabled}
        >
          <Text style={styles.buttonText}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom row - Restart */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={[styles.button, styles.restartButton]}
          onPress={onRestart}
        >
          <Text style={styles.buttonText}>🔄</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#111',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 15,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  rotateButton: {
    backgroundColor: '#FF9800',
  },
  dropButton: {
    backgroundColor: '#F44336',
  },
  moveButton: {
    backgroundColor: '#2196F3',
  },
  downButton: {
    backgroundColor: '#4CAF50',
  },
  restartButton: {
    backgroundColor: '#9C27B0',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default GameControls;
