# Tetron - Classic Tetris for iOS

A classic Tetris game built with React Native and Expo, deployable to iOS via TestFlight.

## Features

- 🎮 Classic Tetris gameplay
- 📱 Touch controls optimized for mobile
- 💯 Score tracking and high scores
- 🎯 Level progression system
- 📊 Lines cleared counter
- ⏸️ Pause/Resume functionality
- 🔄 Next piece preview
- 📱 Haptic feedback (iOS)

## Controls

- **Left/Right arrows**: Move piece horizontally
- **Down arrow**: Soft drop (faster fall)
- **Double down arrow**: Hard drop (instant drop)
- **Rotate button**: Rotate piece clockwise
- **Pause**: Pause/Resume game
- **New**: Start new game

## Development

### Prerequisites

- Node.js 18+
- npm
- Expo account (free)
- Apple Developer account (for iOS deployment)

### Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm start
   ```

3. Test on Windows (web):
   - Press `w` in terminal to open in web browser

### Building for iOS

1. Configure EAS:
   ```bash
   eas build:configure
   ```

2. Build for iOS:
   ```bash
   npm run build:ios
   ```

3. Submit to TestFlight:
   ```bash
   npm run submit:ios
   ```

## Scoring System

- Single line clear: 40 × level
- Double line clear: 100 × level
- Triple line clear: 300 × level
- Tetris (4 lines): 1200 × level
- Soft drop: 1 point per cell
- Hard drop: 2 points per cell dropped

## Level Progression

- Levels increase every 10 lines cleared
- Game speed increases with each level
- Maximum speed reached at level 10

## Project Structure

```
tetron/
├── src/
│   ├── components/    # UI components
│   ├── game/          # Game logic
│   └── utils/         # Helper functions
├── App.js             # Main app component
├── app.json          # Expo configuration
├── eas.json          # EAS Build configuration
└── package.json      # Dependencies
```

## Technologies

- React Native
- Expo
- AsyncStorage (for high scores)
- Expo Haptics (for tactile feedback)
- GitHub Actions (for CI/CD)
- EAS Build (for iOS compilation)

## License

MIT