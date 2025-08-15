# Tetron Setup Guide

## Prerequisites

1. **Apple Developer Account**
   - Active Apple Developer Program membership
   - Team ID (10-character alphanumeric string)
   - App Store Connect access

2. **GitHub Account**
   - Repository with Actions enabled
   - Access to repository secrets

## Apple Developer Setup

### 1. Find Your Apple Team ID
1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Sign in with your Apple ID
3. Navigate to "Certificates, Identifiers & Profiles"
4. Your Team ID is displayed in the top-right corner

### 2. Create App Store Connect API Key
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to "Users and Access" → "Integrations" → "App Store Connect API"
3. Click "Generate API Key"
4. Select "Developer" role
5. Download the `.p8` private key file
6. Note the Key ID and Issuer ID

### 3. Create App Identifier
1. In Apple Developer Portal, go to "Identifiers"
2. Click "+" to create new identifier
3. Select "App IDs"
4. Choose "App" type
5. Set Bundle ID to: `com.ivsemeno.tetron`
6. Set Description to: "Tetron - Tetris Game"
7. Enable required capabilities (if any)

### 4. Create Provisioning Profile
1. Go to "Profiles" in Apple Developer Portal
2. Click "+" to create new profile
3. Select "App Store" distribution type
4. Choose your app identifier: `com.ivsemeno.tetron`
5. Select your distribution certificate
6. Set name: "Tetron App Store Profile"
7. Download the `.mobileprovision` file

### 5. Create Distribution Certificate (if needed)
1. On your Mac, open Keychain Access
2. Request certificate from Certificate Authority
3. Upload CSR to Apple Developer Portal
4. Download the certificate and install in Keychain
5. Export as `.p12` file with password

## GitHub Repository Setup

### 1. Repository Secrets
Add these secrets in GitHub: Repository Settings → Secrets and variables → Actions

#### Required Secrets:
```
APPLE_TEAM_ID=YOUR_10_CHAR_TEAM_ID
APPLE_ISSUER_ID=YOUR_ISSUER_ID_FROM_APP_STORE_CONNECT_API
APPLE_API_KEY_ID=YOUR_API_KEY_ID_FROM_APP_STORE_CONNECT_API
APPLE_API_PRIVATE_KEY=PASTE_CONTENTS_OF_P8_FILE_HERE
APPLE_CERTIFICATE_BASE64=BASE64_ENCODED_P12_CERTIFICATE
APPLE_CERTIFICATE_PASSWORD=PASSWORD_FOR_P12_CERTIFICATE
```

#### How to get Base64 certificate:
On macOS/Linux:
```bash
base64 -i YourCertificate.p12
```

On Windows (PowerShell):
```powershell
[System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes("YourCertificate.p12"))
```

### 2. Update ExportOptions.plist
Replace `YOUR_TEAM_ID` in `ios/ExportOptions.plist` with your actual Team ID.

## Local Development Setup

### Prerequisites
- Node.js 18 or newer
- npm
- For iOS development: macOS with Xcode
- For Windows development: Windows 10+ with Visual Studio

### Installation
```bash
# Clone the repository
git clone https://github.com/ivansemenovv/tetron.git
cd tetron

# Install dependencies
npm install

# For iOS (macOS only)
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on platform
npm run ios     # iOS (macOS only)
npm run android # Android
npm run windows # Windows
```

## App Store Connect Setup

### 1. Create App in App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+"
3. Select "New App"
4. Platform: iOS
5. Name: Tetron
6. Primary Language: English
7. Bundle ID: com.ivsemeno.tetron
8. SKU: tetron-ios (or any unique identifier)

### 2. Configure App Information
1. Set app category (Games → Puzzle)
2. Add app description
3. Upload app icon (1024x1024 PNG)
4. Add screenshots for required device sizes
5. Set age rating
6. Configure TestFlight settings

## Deployment Process

### Automatic Deployment (Recommended)
1. Push code to `main` or `master` branch
2. GitHub Actions will automatically:
   - Build the iOS app
   - Sign with your certificates
   - Upload to TestFlight
   - Notify via email

### Manual Deployment
1. Archive in Xcode
2. Export for App Store distribution
3. Use Transporter app or Xcode Organizer to upload

## Troubleshooting

### Common Issues

1. **Certificate/Provisioning Profile Issues**
   - Ensure certificates are not expired
   - Verify provisioning profile includes your device UDIDs
   - Check bundle identifier matches exactly

2. **Build Failures**
   - Verify Xcode version compatibility
   - Clean build folder (`Product` → `Clean Build Folder`)
   - Delete `node_modules` and reinstall: `npm ci`

3. **TestFlight Upload Issues**
   - Check App Store Connect API key permissions
   - Verify app version/build number is incremented
   - Ensure Info.plist is properly configured

### Getting Help
- Check GitHub Actions logs for detailed error messages
- Verify all secrets are properly set in GitHub
- Test certificate/provisioning profile locally first

## Next Steps
1. Set up all the secrets in GitHub
2. Update `ios/ExportOptions.plist` with your Team ID  
3. Push to main branch to trigger first build
4. Monitor GitHub Actions for any issues
5. Check TestFlight for successful upload
