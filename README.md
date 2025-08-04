# Dreamland Play Cafe PWA

A Progressive Web App (PWA) for Dreamland Play Cafe with iOS-style design and full offline capabilities.

## Features

- **iOS-Style Interface**: Native iOS navigation, animations, and UI components
- **Offline Support**: Works without internet connection using Service Worker
- **Installable**: Can be installed as a standalone app on any device
- **Responsive Design**: Optimized for all screen sizes
- **Touch-Optimized**: Swipe gestures and touch-friendly interface

## Quick Start

### Method 1: Using the Batch File (Windows)
1. Double-click `start-server.bat`
2. Choose option 1 (Python) or 2 (Node.js)
3. The app will open automatically in your browser

### Method 2: Using PowerShell (Windows)
1. Right-click `start-server.ps1`
2. Select "Run with PowerShell"
3. The app will open automatically

### Method 3: Manual Start

#### Python Server:
```bash
python server.py
```

#### Node.js Server:
```bash
node server.js
```

The server will start on `http://localhost:8000`

## Installing as an App

### On iPhone/iPad:
1. Open the app in Safari (not Chrome)
2. Tap the Share button
3. Select "Add to Home Screen"
4. Choose a name and tap "Add"

### On Android:
1. Open the app in Chrome
2. You'll see an "Install App" prompt
3. Tap "Install"

### On Desktop (Chrome/Edge):
1. Look for the install icon in the address bar
2. Click "Install"

## Testing on Mobile

To test on your phone:
1. Make sure your phone and computer are on the same Wi-Fi network
2. Find your computer's IP address:
   - Windows: Run `ipconfig` in Command Prompt
   - Mac/Linux: Run `ifconfig` in Terminal
3. On your phone, open: `http://[YOUR-IP]:8000`

## File Structure

```
Dreamland/
├── index.html          # Main HTML file
├── styles.css          # iOS-style CSS
├── app.js             # JavaScript functionality
├── manifest.json      # PWA manifest
├── service-worker.js  # Offline functionality
├── icons/            # App icons (all sizes)
├── server.py         # Python development server
├── server.js         # Node.js development server
└── README.md         # This file
```

## Features Included

### Navigation
- Side menu with smooth animations
- Bottom tab bar for quick access
- Cart functionality with badge

### Content Sections
- Hero slideshow with touch swipe support
- Location & hours information
- Vision/About section
- Birthday party packages with tabs
- Membership plans
- FAQ accordion
- Booking modal

### PWA Features
- Service Worker for offline mode
- App manifest for installation
- Push notification support
- Background sync capability
- All required app icons

## Browser Support

- iOS Safari 11.3+
- Chrome 67+
- Firefox 57+
- Edge 17+
- Samsung Internet 6.2+

## Troubleshooting

### Server won't start
- Make sure Python or Node.js is installed
- Check if port 8000 is already in use
- Try a different port: `python server.py --port 8080`

### PWA won't install
- Must be served over HTTPS or localhost
- Check that all icons are present
- Verify manifest.json is valid

### Service Worker issues
- Clear browser cache and reload
- Check console for errors
- Ensure service-worker.js is in root directory

## Development

To modify the app:
1. Edit the HTML, CSS, or JavaScript files
2. Refresh the browser to see changes
3. For Service Worker changes, you may need to:
   - Clear cache
   - Unregister old Service Worker
   - Reload the page

## Contact

For issues or questions about the PWA, please contact the development team.

---

Built with ❤️ for Dreamland Play Cafe