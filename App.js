import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
  Modal,
  Switch,
  PanResponder
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GameBoard from './src/components/GameBoard';
import NextPiece from './src/components/NextPiece';
import DPad from './src/components/DPad';
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
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const gameLoopRef = useRef(null);
  const boardRef = useRef(null);

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
    setPiecePosition({ x: piecePosition.x, y: newY });
    setScore(prev => prev + dropDistance * 2);
    
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    // Force immediate lock of the piece
    const newBoard = mergePiece(board, currentPiece.shape, piecePosition.x, newY, currentPiece.color);
    const { clearedBoard, linesCleared } = clearLines(newBoard);
    
    setBoard(clearedBoard);
    
    if (linesCleared > 0) {
      setLines(prev => prev + linesCleared);
      const points = [40, 100, 300, 1200][linesCleared - 1] * level;
      setScore(prev => prev + points);
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
    
    setCurrentPiece(null);
    setTimeout(() => spawnPiece(), 0);
  }, [board, currentPiece, piecePosition, isPaused, isGameOver, level, spawnPiece]);

  const lockPiece = useCallback(() => {
    if (!currentPiece) return;
    
    const newBoard = mergePiece(board, currentPiece.shape, piecePosition.x, piecePosition.y, currentPiece.color);
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
    if (isPaused || isGameOver || showMenu) {
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
        setScore(s => s + 1);
      }
    }, dropTime);
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [currentPiece, isPaused, isGameOver, showMenu, dropTime, movePiece, lockPiece, spawnPiece]);

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
    setShowMenu(false);
    setDropTime(1000);
  };

  const togglePause = () => {
    if (!isGameOver) {
      if (showMenu) {
        // If menu is showing, close it and unpause
        setShowMenu(false);
        setIsPaused(false);
      } else {
        // If menu is not showing, open it and pause
        setShowMenu(true);
        setIsPaused(true);
      }
    }
  };

  const resumeGame = () => {
    setShowMenu(false);
    setIsPaused(false);
  };

  const restart = () => {
    setShowMenu(false);
    setIsPaused(false);
    startNewGame();
  };

  // Gesture handling for board taps
  const handleBoardTouch = (evt) => {
    if (isPaused || isGameOver || showMenu) return;
    
    const { locationX, locationY } = evt.nativeEvent;
    const boardWidth = evt.target._nativeTag && evt.target._nativeTag.width || screenWidth - 20;
    const boardHeight = evt.target._nativeTag && evt.target._nativeTag.height || screenHeight * 0.6;
    
    // Tap on left third - move left
    if (locationX < boardWidth / 3) {
      movePiece(-1, 0);
    }
    // Tap on right third - move right
    else if (locationX > (boardWidth * 2) / 3) {
      movePiece(1, 0);
    }
    // Tap in middle - rotate
    else {
      rotate();
    }
  };

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (isPaused || isGameOver || showMenu) return;
        
        const { dy } = gestureState;
        
        // Swipe up for hard drop
        if (dy < -50) {
          hardDrop();
        }
      },
    })
  ).current;

  // Keyboard support for web
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    
    const handleKeyPress = (e) => {
      if (showMenu || showSettings) return;
      
      if (isGameOver) {
        if (e.key === 'r' || e.key === 'R') {
          startNewGame();
        }
        return;
      }
      
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        togglePause();
        return;
      }
      
      if (isPaused) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          hardDrop();
          break;
        case 'ArrowUp':
        case ' ':
          rotate();
          break;
        case 'r':
        case 'R':
          startNewGame();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, rotate, hardDrop, togglePause, startNewGame, isPaused, isGameOver, showMenu, showSettings]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>TETRON</Text>
        <TouchableOpacity onPress={togglePause} style={styles.menuButton}>
          <Text style={styles.menuIcon}>⚙</Text>
        </TouchableOpacity>
      </View>
      
      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>{score.toLocaleString()}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>High</Text>
          <Text style={styles.statValue}>{highScore.toLocaleString()}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Lines</Text>
          <Text style={styles.statValue}>{lines}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Level</Text>
          <Text style={styles.statValue}>{level}</Text>
        </View>
      </View>
      
      {/* Game Area */}
      <View style={styles.gameArea}>
        <View 
          style={styles.boardContainer}
          onTouchEnd={handleBoardTouch}
          {...panResponder.panHandlers}
        >
          <GameBoard 
            board={board}
            currentPiece={currentPiece}
            piecePosition={piecePosition}
          />
          
          {/* Floating Next Piece */}
          <View style={styles.floatingNext}>
            <NextPiece piece={nextPiece} />
          </View>
        </View>
      </View>
      
      {/* D-Pad Control */}
      <View style={styles.controls}>
        <DPad
          onLeft={() => movePiece(-1, 0)}
          onRight={() => movePiece(1, 0)}
          onUp={() => rotate()}
          onDown={() => hardDrop()}
          disabled={isPaused || isGameOver || showMenu}
        />
      </View>
      
      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuModal}>
            <Text style={styles.menuTitle}>PAUSED</Text>
            
            <TouchableOpacity style={styles.menuButton} onPress={resumeGame}>
              <Text style={styles.menuButtonText}>RESUME</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuButton} onPress={restart}>
              <Text style={styles.menuButtonText}>RESTART</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuButton} onPress={startNewGame}>
              <Text style={styles.menuButtonText}>NEW GAME</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuButton} 
              onPress={() => {
                setShowSettings(true);
                setShowMenu(false);
              }}
            >
              <Text style={styles.menuButtonText}>SETTINGS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.settingsModal}>
            <Text style={styles.menuTitle}>SETTINGS</Text>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Controls</Text>
              <Text style={styles.settingInfo}>• Tap left/right sides to move</Text>
              <Text style={styles.settingInfo}>• Tap center to rotate</Text>
              <Text style={styles.settingInfo}>• Swipe up for hard drop</Text>
              <Text style={styles.settingInfo}>• Use buttons for precise control</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.menuButton} 
              onPress={() => {
                setShowSettings(false);
                setShowMenu(true);
              }}
            >
              <Text style={styles.menuButtonText}>BACK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Game Over Modal */}
      {isGameOver && (
        <Modal
          visible={isGameOver}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.gameOverModal}>
              <Text style={styles.gameOverText}>GAME OVER</Text>
              <Text style={styles.finalScore}>Score: {score}</Text>
              {score === highScore && score > 0 && (
                <Text style={styles.newHighScore}>NEW HIGH SCORE!</Text>
              )}
              <TouchableOpacity 
                style={styles.menuButton}
                onPress={startNewGame}
              >
                <Text style={styles.menuButtonText}>NEW GAME</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0f0f1e',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f39c12',
    letterSpacing: 3,
  },
  menuButton: {
    padding: 5,
  },
  menuIcon: {
    fontSize: 24,
    color: '#ecf0f1',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#34495e',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statLabel: {
    color: '#95a5a6',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statValue: {
    color: '#ecf0f1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#34495e',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 100, // Space for controls
  },
  boardContainer: {
    position: 'relative',
  },
  floatingNext: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(44, 62, 80, 0.9)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#34495e',
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuModal: {
    backgroundColor: '#2c3e50',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 250,
  },
  settingsModal: {
    backgroundColor: '#2c3e50',
    padding: 30,
    borderRadius: 10,
    minWidth: 300,
  },
  gameOverModal: {
    backgroundColor: '#2c3e50',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f39c12',
    marginBottom: 20,
  },
  menuButton: {
    backgroundColor: '#34495e',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 5,
    marginVertical: 5,
    minWidth: 150,
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#ecf0f1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingRow: {
    marginBottom: 20,
  },
  settingLabel: {
    color: '#ecf0f1',
    fontSize: 16,
    marginBottom: 10,
  },
  settingInfo: {
    color: '#95a5a6',
    fontSize: 14,
    marginVertical: 2,
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
});