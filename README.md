# Tetron - Classic Tetris for iOS

A classic Tetris game built with React Native and Expo, deployable to iOS via TestFlight.

## Features

- 🎮 Classic Tetris gameplay with all 7 tetromino pieces
- 📱 Touch controls optimized for mobile (D-pad layout)
- 👆 Gesture support (tap to move/rotate, swipe up for hard drop)
- 💯 Score tracking with persistent high scores
- 🎯 Level progression system (every 10 lines)
- 📊 Real-time statistics (score, lines, level)
- ⏸️ Pause/Resume with in-game menu
- 🔄 Next piece preview
- 📱 Haptic feedback (iOS)
- 🌈 Original Tetris colors preserved
- ⌨️ Full keyboard support for web testing

## Controls

### Mobile Controls
- **◄ Button**: Move piece left
- **↻ Button**: Rotate piece clockwise  
- **⇊ Button**: Hard drop (instant drop)
- **► Button**: Move piece right
- **⚙ Icon**: Pause/Menu

### Gesture Controls
- **Tap left side of board**: Move left
- **Tap right side of board**: Move right
- **Tap center of board**: Rotate
- **Swipe up**: Hard drop

### Keyboard Controls (Web)
- **Arrow Left/Right**: Move piece
- **Arrow Up or Space**: Rotate
- **Arrow Down**: Hard drop
- **P or Escape**: Pause
- **R**: New game

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm 9+
- Expo account (free at https://expo.dev)
- Apple Developer account ($99/year for iOS deployment)
- EAS CLI for building

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/ivansemenovv/tetron.git
cd tetron

# Install dependencies
npm install
```

### Step 2: Install EAS CLI

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Verify installation
eas --version

# Login to your Expo account
eas login
```

### Step 3: Configure EAS Build

```bash
# Initialize EAS in your project
eas build:configure

# This will:
# - Create/update eas.json
# - Generate a project ID
# - Link to your Expo account
```

### Step 4: Update Configuration

Edit `eas.json` and add your Apple Team ID:
```json
{
  "submit": {
    "production": {
      "ios": {
        "appleTeamId": "YOUR_TEAM_ID_HERE"
      }
    }
  }
}
```

To find your Apple Team ID:
1. Go to [Apple Developer Portal](https://developer.apple.com/account)
2. Sign in → Membership Details → Team ID (10 characters)

## Development

### Run Locally

```bash
# Start development server
npm start

# For web testing (press 'w' after start)
# For iOS Simulator (press 'i' after start, requires Mac)
# For Android (press 'a' after start)
```

### Run in Offline Mode (if Expo servers are down)

```bash
# Windows PowerShell
$env:EXPO_OFFLINE=1; npx expo start

# Windows CMD
set EXPO_OFFLINE=1 && npx expo start

# Mac/Linux
EXPO_OFFLINE=1 npx expo start
```

## Building for iOS

### Step 1: Build the App

```bash
# Build for iOS (production)
eas build --platform ios --profile production

# Or use npx if EAS not installed globally
npx eas-cli build --platform ios --profile production
```

During first build, EAS will ask:
- How to handle credentials → Choose "Expo handles this"
- Apple ID → Enter your Apple Developer account email
- App-specific password → Create at [appleid.apple.com](https://appleid.apple.com)

### Step 2: Submit to TestFlight

```bash
# Submit latest build to TestFlight
eas submit -p ios --latest

# Or specify a specific build
eas submit -p ios
```

### Step 3: Configure TestFlight

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app → TestFlight tab
3. Complete Test Information:
   - Beta App Description
   - Email
   - Privacy Policy URL
4. Add testers (internal or external)

### Step 4: Install on iPhone

1. Install TestFlight app from App Store
2. Accept email invitation
3. Install and test Tetron

## GitHub Actions (CI/CD)

### Setup Automated Builds

1. Get Expo token from [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens)

2. Add GitHub Secrets:
   - Go to repository Settings → Secrets → Actions
   - Add `EXPO_TOKEN` and `APPLE_TEAM_ID`

3. Push to main branch to trigger automatic builds

## Scoring System

- **Single line**: 40 × level points
- **Double line**: 100 × level points  
- **Triple line**: 300 × level points
- **Tetris (4 lines)**: 1200 × level points
- **Hard drop**: 2 points per cell dropped
- **Soft drop**: 1 point per cell

## Level Progression

- Start at Level 1
- Advance every 10 lines cleared
- Speed increases with each level
- Maximum speed at Level 10

## Troubleshooting

### Build Errors

```bash
# Clear caches
npx expo start --clear
rm -rf node_modules .expo
npm install

# Reset EAS credentials
eas credentials
```

### Network Issues

```bash
# Run in offline mode
EXPO_OFFLINE=1 npx expo start

# Use localhost only
npx expo start --localhost
```

### iOS Submission Issues

- Verify Apple Team ID is correct
- Check app-specific password is valid
- Ensure bundle identifier is unique
- Check App Store Connect for errors

## Technologies Used

- React Native & Expo SDK 52
- React Native Web (for browser testing)
- AsyncStorage (persistent storage)
- Expo Haptics (tactile feedback)
- EAS Build (cloud building)
- TestFlight (iOS distribution)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT

## Support

- Expo Discord: https://chat.expo.dev
- EAS Documentation: https://docs.expo.dev/build/introduction/
- Apple Developer: https://developer.apple.com