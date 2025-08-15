# Tetron - Windows Testing Guide

Since you want to be able to test the game on Windows while developing, here are the options:

## Option 1: React Native for Windows (Recommended for Development)

### Setup React Native Windows
```bash
# Install React Native Windows CLI
npm install -g @react-native-community/cli @react-native-community/cli-platform-windows

# Initialize Windows project
npx react-native-windows-init --overwrite --version 0.73.2

# Run on Windows
npx react-native run-windows
```

### Requirements
- Windows 10 version 1903 or higher
- Visual Studio 2019 or 2022 with:
  - Desktop development with C++
  - Windows 10/11 SDK

## Option 2: Expo Web (Quick Testing)

For quick testing without Windows-specific setup:

```bash
# Install Expo CLI
npm install -g @expo/cli

# Create expo config
npx expo install

# Run on web
npx expo start --web
```

## Option 3: React Native Web

Add web support to the existing React Native project:

```bash
# Install web dependencies
npm install react-dom react-native-web
npm install --save-dev @types/react-dom webpack webpack-cli webpack-dev-server babel-loader

# Create web configuration
# (Additional webpack config needed)
```

## Recommended Approach

For your use case, I recommend starting with **React Native for Windows** since:
1. You want true Windows compatibility
2. It maintains the React Native architecture
3. Code sharing between iOS and Windows is maximized
4. Touch controls can be adapted to mouse/keyboard

## Current Status

The game is currently set up as a React Native project with:
- ✅ Core game logic implemented
- ✅ TypeScript setup
- ✅ Component architecture
- ✅ GitHub Actions for iOS
- ⏳ Windows project needs initialization
- ⏳ iOS project needs Xcode setup

## Next Steps

1. **For Windows Development:**
   ```bash
   cd C:\git\tetson
   npx react-native-windows-init --overwrite
   ```

2. **For iOS Development:**
   - Set up GitHub secrets as described in SETUP.md
   - Push to GitHub to trigger iOS build
   - Or set up on a Mac with Xcode

Would you like me to initialize the Windows project now, or would you prefer to focus on the iOS deployment first?
