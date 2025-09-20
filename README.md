# Podcast App

A beautiful, modern React Native podcast app built with Expo. Features a dark theme, interactive podcast cards, and a sleek user interface.

## Features

- 🎧 **Modern UI Design** - Dark theme with beautiful gradients and smooth animations
- 📱 **Responsive Layout** - Optimized for both phones and tablets
- 🎵 **Interactive Podcast Cards** - Tap to play/pause podcasts
- 📂 **Category Browsing** - Browse podcasts by different categories
- 🎨 **Beautiful Images** - High-quality podcast cover images
- ⚡ **Fast Performance** - Built with React Native for optimal performance

## Screenshots

The app features:
- A sleek header with app branding
- A "Now Playing" section that appears when a podcast is selected
- Horizontal scrolling featured podcasts with cover images
- Category browsing with pill-shaped buttons
- Modern dark theme throughout

## Prerequisites

Before running this app, make sure you have:

- Node.js (version 20.19.4 or higher recommended)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (for testing)

## Installation

1. **Clone or download this project**
   ```bash
   cd podcast-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## Running the App

### On Mobile Device (Recommended)
1. Install the **Expo Go** app from the App Store (iOS) or Google Play Store (Android)
2. Run `npm start` in your terminal
3. Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android)

### On iOS Simulator
```bash
npm run ios
```

### On Android Emulator
```bash
npm run android
```

### On Web Browser
```bash
npm run web
```

## Project Structure

```
podcast-app/
├── App.js              # Main app component
├── app.json            # Expo configuration
├── package.json        # Dependencies and scripts
├── assets/             # Images and icons
│   ├── icon.png
│   ├── splash-icon.png
│   └── adaptive-icon.png
└── README.md           # This file
```

## Key Components

- **App.js** - Main component with podcast data and UI
- **Header** - App branding and navigation
- **Now Playing** - Current podcast player (appears when podcast is selected)
- **Featured Podcasts** - Horizontal scrolling podcast cards
- **Categories** - Browse podcasts by category

## Customization

### Adding New Podcasts
Edit the `podcasts` array in `App.js`:

```javascript
const podcasts = [
  {
    id: 5,
    title: "Your New Podcast",
    host: "Host Name",
    duration: "30 min",
    image: "https://your-image-url.com/image.jpg",
    category: "Your Category"
  }
];
```

### Changing Colors
Modify the color scheme in the `styles` object:

```javascript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a0a', // Dark background
  },
  // ... other styles
});
```

### Adding Categories
Update the categories array in the Categories section:

```javascript
{['Technology', 'Wellness', 'Business', 'Arts', 'Science', 'Comedy', 'Your Category'].map((category) => (
  // ... category rendering
))}
```

## Technologies Used

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **React Hooks** - State management (useState)
- **StyleSheet** - Styling and layout
- **SafeAreaView** - Safe area handling for different devices

## Development Notes

- The app uses placeholder images from Unsplash
- All podcast data is currently static (no backend integration)
- The play/pause functionality is UI-only (no actual audio playback)
- Images are loaded from external URLs (ensure internet connection)

## Next Steps

To make this a fully functional podcast app, consider adding:

- Audio playback functionality (expo-av)
- Backend API integration
- User authentication
- Podcast search and filtering
- Favorites and playlists
- Push notifications
- Offline listening capabilities

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **Image loading problems**: Check internet connection
3. **Build errors**: Ensure Node.js version compatibility
4. **Expo Go connection**: Make sure device and computer are on same network

### Getting Help

- Check the [Expo documentation](https://docs.expo.dev/)
- Visit [React Native docs](https://reactnative.dev/)
- Join the [Expo Discord community](https://discord.gg/expo)

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy coding! 🎧📱**
