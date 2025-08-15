import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';

import { GameState } from '../types/game';
import {
  createInitialGameState,
  moveTetrominoDown,
  moveTetrominoHorizontal,
  rotateCurrentTetromino,
  dropTetromino,
} from '../game/gameEngine';

import GameBoard from './GameBoard';
import GameControls from './GameControls';
import GameStats from './GameStats';
import NextPieceDisplay from './NextPieceDisplay';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const TetrisGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const dropSpeedRef = useRef<number>(1000); // Initial drop speed in ms

  // Calculate drop speed based on level
  const calculateDropSpeed = useCallback((level: number): number => {
    return Math.max(100, 1000 - (level - 1) * 100);
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    setGameState(prevState => {
      if (prevState.isGameOver || prevState.isPaused) {
        return prevState;
      }
      return moveTetrominoDown(prevState);
    });
  }, []);

  // Start/stop game loop
  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    gameLoopRef.current = setInterval(gameLoop, dropSpeedRef.current);
  }, [gameLoop]);

  const stopGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  // Update drop speed when level changes
  useEffect(() => {
    dropSpeedRef.current = calculateDropSpeed(gameState.level);
    if (!gameState.isGameOver && !gameState.isPaused) {
      startGameLoop();
    }
  }, [gameState.level, gameState.isGameOver, gameState.isPaused, startGameLoop, calculateDropSpeed]);

  // Start game loop on mount
  useEffect(() => {
    startGameLoop();
    return () => stopGameLoop();
  }, [startGameLoop, stopGameLoop]);

  // Game controls
  const moveLeft = useCallback(() => {
    setGameState(prevState => moveTetrominoHorizontal(prevState, -1));
  }, []);

  const moveRight = useCallback(() => {
    setGameState(prevState => moveTetrominoHorizontal(prevState, 1));
  }, []);

  const rotatePiece = useCallback(() => {
    setGameState(prevState => rotateCurrentTetromino(prevState));
  }, []);

  const dropPiece = useCallback(() => {
    setGameState(prevState => dropTetromino(prevState));
  }, []);

  const moveDownFast = useCallback(() => {
    setGameState(prevState => moveTetrominoDown(prevState));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prevState => {
      const newPaused = !prevState.isPaused;
      if (newPaused) {
        stopGameLoop();
      } else {
        startGameLoop();
      }
      return { ...prevState, isPaused: newPaused };
    });
  }, [startGameLoop, stopGameLoop]);

  const restartGame = useCallback(() => {
    stopGameLoop();
    setGameState(createInitialGameState());
    setTimeout(startGameLoop, 100);
  }, [startGameLoop, stopGameLoop]);

  // Handle game over
  useEffect(() => {
    if (gameState.isGameOver) {
      stopGameLoop();
      Alert.alert(
        'Game Over!',
        `Final Score: ${gameState.score}\\nLines: ${gameState.lines}\\nLevel: ${gameState.level}`,
        [
          {
            text: 'Play Again',
            onPress: restartGame,
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    }
  }, [gameState.isGameOver, gameState.score, gameState.lines, gameState.level, stopGameLoop, restartGame]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>TETRON</Text>
        <TouchableOpacity 
          style={styles.pauseButton} 
          onPress={pauseGame}
        >
          <Text style={styles.pauseButtonText}>
            {gameState.isPaused ? '▶️' : '⏸️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {/* Left Panel - Stats and Next Piece */}
        <View style={styles.leftPanel}>
          <GameStats 
            score={gameState.score}
            level={gameState.level}
            lines={gameState.lines}
          />
          <NextPieceDisplay nextPiece={gameState.nextPiece} />
        </View>

        {/* Game Board */}
        <View style={styles.gameBoard}>
          <GameBoard gameState={gameState} />
        </View>
      </View>

      {/* Controls */}
      <GameControls
        onMoveLeft={moveLeft}
        onMoveRight={moveRight}
        onRotate={rotatePiece}
        onDrop={dropPiece}
        onMoveDown={moveDownFast}
        onRestart={restartGame}
        disabled={gameState.isGameOver}
      />

      {/* Pause Overlay */}
      {gameState.isPaused && (
        <View style={styles.pauseOverlay}>
          <Text style={styles.pauseText}>PAUSED</Text>
          <TouchableOpacity style={styles.resumeButton} onPress={pauseGame}>
            <Text style={styles.resumeButtonText}>Resume</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  pauseButton: {
    padding: 10,
  },
  pauseButtonText: {
    fontSize: 24,
  },
  gameArea: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  leftPanel: {
    flex: 1,
    paddingRight: 10,
  },
  gameBoard: {
    flex: 2,
    aspectRatio: 0.5,
    alignSelf: 'center',
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  resumeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TetrisGame;
