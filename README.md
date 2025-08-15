# Tetron - React Native Tetris Game

A classic Tetris game built with React Native for iOS and Windows, with automated builds via GitHub Actions and TestFlight distribution.

## Features
- Classic Tetris gameplay
- Touch controls (swipe/tap) and on-screen buttons
- Scoring system and high scores
- Cross-platform (iOS and Windows)

## Setup

### Prerequisites
- Node.js (v18 or newer)
- npm
- Apple Developer Account
- GitHub Account

### Installation
```bash
npm install
```

### Development
```bash
# Start Metro bundler
npm start

# Run on iOS (requires macOS and Xcode)
npm run ios

# Run on Windows
npm run windows
```

### Build for Production
GitHub Actions will automatically build and deploy to TestFlight when pushing to the main branch.

## Project Structure
```
tetron/
├── src/
│   ├── components/     # Game components
│   ├── game/          # Game logic
│   ├── utils/         # Utilities
│   └── screens/       # App screens
├── ios/               # iOS specific files
├── windows/           # Windows specific files
├── android/           # Android specific files (future)
├── .github/           # GitHub Actions workflows
└── assets/            # Game assets
```

## License
MIT
