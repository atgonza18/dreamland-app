# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Progressive Web App (PWA) for Dreamland Play Cafe, featuring an iOS-style design with full offline capabilities. The app is built with vanilla HTML, CSS, and JavaScript without any build tools or framework dependencies.

## Development Commands

### Starting the Development Server

**Python Server (recommended):**
```bash
python server.py
```

**Node.js Server (alternative):**
```bash
node server.js
```

**Windows Quick Start:**
- Double-click `start-server.bat` and choose Python or Node.js
- Or run `start-server.ps1` in PowerShell

The server runs on `http://localhost:8000` by default.

### Testing on Mobile Devices

1. Ensure phone and computer are on the same Wi-Fi network
2. Find computer's IP address (`ipconfig` on Windows)
3. Access `http://[YOUR-IP]:8000` on mobile device

## Architecture

### Core Structure

The app is a single-page Progressive Web App (PWA):

- **Main App (`index.html`)**: Single-page application with all sections
- **Service Worker**: Enables offline functionality and caching strategy
- **PWA Manifest**: Configures app installation and appearance

### Key Components

**Navigation System:**
- Side menu with slide-in animation
- Bottom tab bar for quick navigation
- Both menus sync with current page/section

**Content Management:**
- Hero slideshow with touch/swipe support
- FAQ accordion system
- Tab-based package selection for parties
- Modal system for booking forms

**Offline Strategy:**
- Network-first approach with cache fallback
- Caches core assets on install
- Updates cache when online

### File Responsibilities

- `app-ios.js`: Main JavaScript functionality and interactions
- `styles-ios.css`: iOS-inspired styling
- `service-worker.js`: Offline caching and PWA features
- `manifest.json`: PWA configuration
- `server.py` / `server.js`: Development servers with proper MIME types

## Important Implementation Details

### Service Worker Updates
When modifying `service-worker.js`:
1. Update the `CACHE_NAME` version
2. Clear browser cache or unregister old worker
3. Reload to see changes

### In-App Navigation
The app uses JavaScript-based navigation to switch between sections within the single page. Smooth scrolling is used for section transitions.

### Icons
Multiple icon sizes are pre-generated for PWA compatibility across devices (located in the `icons/` folder).

### Supported External Domain
The app fetches content from `dreamlandplaycafe.com` - ensure CORS headers are properly configured in the server files.