# 🚀 Installation Guide for Sno Cast

## ⚠️ Current Issue
There seems to be a system-level npm issue preventing package installation. Here's how to fix it:

## 🔧 Manual Installation Steps

### Option 1: Fix npm and install packages

1. **Clear npm cache completely:**
   ```bash
   npm cache clean --force
   rm -rf ~/.npm
   rm -rf node_modules package-lock.json
   ```

2. **Try installing with different methods:**
   ```bash
   # Method 1: Use npm with legacy peer deps
   npm install --legacy-peer-deps @react-native-async-storage/async-storage axios
   
   # Method 2: Use yarn
   yarn add @react-native-async-storage/async-storage axios
   
   # Method 3: Use pnpm
   pnpm add @react-native-async-storage/async-storage axios
   ```

### Option 2: Use Expo CLI to install

1. **Install the new Expo CLI:**
   ```bash
   npm install -g @expo/cli
   ```

2. **Use Expo to install packages:**
   ```bash
   npx expo install @react-native-async-storage/async-storage axios
   ```

### Option 3: Create a new Expo project and copy files

1. **Create a new Expo project:**
   ```bash
   npx create-expo-app sno-cast-new --template blank
   cd sno-cast-new
   ```

2. **Install required packages:**
   ```bash
   npx expo install @react-native-async-storage/async-storage axios
   ```

3. **Copy your files:**
   - Copy `App.js` from the current project
   - Copy the `screens/` folder
   - Copy the `services/` folder
   - Copy the `assets/` folder

## 🔄 After Installation

Once packages are installed, replace the temporary workarounds:

### 1. Update `services/api.js`:
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
```

### 2. Update `services/authService.js`:
```javascript
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
```

## 🚀 Start the App

1. **Start the backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start the frontend:**
   ```bash
   npm start
   ```

## 🐛 Troubleshooting

If you still have issues:

1. **Check Node.js version:**
   ```bash
   node --version
   # Should be 16+ but not 20+ for Expo
   ```

2. **Try using nvm to switch Node versions:**
   ```bash
   nvm install 18
   nvm use 18
   ```

3. **Check if you have the right permissions:**
   ```bash
   ls -la /Users/ramakant/podcast-app
   ```

## 📱 Current Status

The app is currently set up with temporary workarounds that will:
- ✅ Display the beautiful UI
- ✅ Show sign-in/sign-up screens
- ⚠️ Store data in memory only (not persistent)
- ⚠️ Use fetch instead of axios (less features)

Once you install the packages, everything will work perfectly with full persistence and all features!

## 🆘 Need Help?

If you're still having issues, try:
1. Restart your terminal
2. Restart your computer
3. Use a different package manager (yarn/pnpm)
4. Create a fresh Expo project and copy the files over
