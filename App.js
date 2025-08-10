import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  SafeAreaView,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GameBoard from './src/components/GameBoard';
import NextPiece from './src/components/NextPiece';
import Score from './src/components/Score';
import Controls from './src/components/Controls';
import {
  createEmptyGrid,
  createPiece,
  isValidMove,
  rotatePiece,
  mergePiece,
  clearLines,
  BOARD_WIDTH,
  BOARD_HEIGHT
} from './src/game/gameLogic';
import { TETROMINOS } from './src/game/tetrominos';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function App() {
  const [board, setBoard] = useState(createEmptyGrid());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [piecePosition, setPiecePosition] = useState({ x: 0, y: 0 });
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dropTime, setDropTime] = useState(1000);

  const gameLoopRef = useRef(null);

  // Load high score on mount
  useEffect(() => {
    loadHighScore();
  }, []);

  // Save high score when it changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      saveHighScore(score);
    }
  }, [score, highScore]);

  // Update level and drop speed based on lines cleared
  useEffect(() => {
    const newLevel = Math.floor(lines / 10) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
      setDropTime(Math.max(100, 1000 - (newLevel - 1) * 100));
    }
  }, [lines, level]);

  const loadHighScore = async () => {
    try {
      const saved = await AsyncStorage.getItem('tetron_highscore');
      if (saved !== null) {
        setHighScore(parseInt(saved, 10));
      }
    } catch (error) {
      console.error('Error loading high score:', error);
    }
  };

  const saveHighScore = async (score) => {
    try {
      await AsyncStorage.setItem('tetron_highscore', score.toString());
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  };

  const spawnPiece = useCallback(() => {
    const piece = nextPiece || createPiece();
    const next = createPiece();
    const startX = Math.floor((BOARD_WIDTH - piece.shape[0].length) / 2);

    if (!isValidMove(board, piece.shape, startX, 0)) {
      setIsGameOver(true);
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return false;
    }

    setCurrentPiece(piece);
    setPiecePosition({ x: startX, y: 0 });
    setNextPiece(next);
    return true;
  }, [board, nextPiece]);

  const movePiece = useCallback((dx, dy) => {
    if (!currentPiece || isPaused || isGameOver) return false;

    const newX = piecePosition.x + dx;
    const newY = piecePosition.y + dy;

    if (isValidMove(board, currentPiece.shape, newX, newY)) {
      setPiecePosition({ x: newX, y: newY });
      if (dx !== 0 && Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      return true;
    }

    return false;
  }, [board, currentPiece, piecePosition, isPaused, isGameOver]);

  const rotate = useCallback(() => {
    if (!currentPiece || isPaused || isGameOver) return;

    const rotated = rotatePiece(currentPiece.shape);

    if (isValidMove(board, rotated, piecePosition.x, piecePosition.y)) {
      setCurrentPiece({ ...currentPiece, shape: rotated });
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  }, [board, currentPiece, piecePosition, isPaused, isGameOver]);

  const hardDrop = useCallback(() => {
    if (!currentPiece || isPaused || isGameOver) return;

    let newY = piecePosition.y;
    while (isValidMove(board, currentPiece.shape, piecePosition.x, newY + 1)) {
      newY++;
    }

    const dropDistance = newY - piecePosition.y;
    setScore(s => s + dropDistance * 2);
    setPiecePosition({ ...piecePosition, y: newY });

    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    // Lock piece immediately after hard drop
    setTimeout(() => lockPiece(), 50);
  }, [board, currentPiece, piecePosition, isPaused, isGameOver]);

  const lockPiece = useCallback(() => {
    if (!currentPiece) return;

    const newBoard = mergePiece(board, currentPiece.shape, piecePosition.x, piecePosition.y);
    const { clearedBoard, linesCleared } = clearLines(newBoard);

    setBoard(clearedBoard);

    if (linesCleared > 0) {
      setLines(l => l + linesCleared);
      const points = [40, 100, 300, 1200][linesCleared - 1] * level;
      setScore(s => s + points);

      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }

    setCurrentPiece(null);
    spawnPiece();
  }, [board, currentPiece, piecePosition, level, spawnPiece]);

  // Game loop
  useEffect(() => {
    if (isPaused || isGameOver) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    if (!currentPiece && !isGameOver) {
      spawnPiece();
    }

    gameLoopRef.current = setInterval(() => {
      if (!currentPiece) return;

      if (!movePiece(0, 1)) {
        lockPiece();
      } else {
        setScore(s => s + 1); // Soft drop points
      }
    }, dropTime);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [currentPiece, isPaused, isGameOver, dropTime, movePiece, lockPiece, spawnPiece]);

  const startNewGame = () => {
    setBoard(createEmptyGrid());
    setCurrentPiece(null);
    setPiecePosition({ x: 0, y: 0 });
    setNextPiece(null);
    setScore(0);
    setLines(0);
    setLevel(1);
    setIsGameOver(false);
    setIsPaused(false);
    setDropTime(1000);
  };

  const togglePause = () => {
    if (!isGameOver) {
      setIsPaused(!isPaused);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>TETRON</Text>
      </View>

      <View style={styles.gameContainer}>
        <View style={styles.sidePanel}>
          <NextPiece piece={nextPiece} />
          <Score
            score={score}
            lines={lines}
            level={level}
            highScore={highScore}
          />
        </View>

        <GameBoard
          board={board}
          currentPiece={currentPiece}
          piecePosition={piecePosition}
        />
      </View>

      <Controls
        onMoveLeft={() => movePiece(-1, 0)}
        onMoveRight={() => movePiece(1, 0)}
        onMoveDown={() => movePiece(0, 1)}
        onRotate={rotate}
        onHardDrop={hardDrop}
        onPause={togglePause}
        onNewGame={startNewGame}
        isPaused={isPaused}
        isGameOver={isGameOver}
      />

      {isGameOver && (
        <View style={styles.gameOverOverlay}>
          <View style={styles.gameOverContent}>
            <Text style={styles.gameOverText}>GAME OVER</Text>
            <Text style={styles.finalScore}>Score: {score}</Text>
            {score === highScore && score > 0 && (
              <Text style={styles.newHighScore}>NEW HIGH SCORE!</Text>
            )}
            <TouchableOpacity
              style={styles.newGameButton}
              onPress={startNewGame}
            >
              <Text style={styles.newGameButtonText}>NEW GAME</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f39c12',
    letterSpacing: 4,
  },
  gameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
    flex: 1,
  },
  sidePanel: {
    marginRight: 10,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverContent: {
    backgroundColor: '#2c3e50',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 15,
  },
  finalScore: {
    fontSize: 20,
    color: '#ecf0f1',
    marginBottom: 10,
  },
  newHighScore: {
    fontSize: 18,
    color: '#f39c12',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  newGameButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  newGameButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});