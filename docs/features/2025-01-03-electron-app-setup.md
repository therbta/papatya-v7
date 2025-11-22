# Electron App Setup - Papatya mIRC Client Desktop Version

## Overview

This document describes the Electron desktop application setup for Papatya v7, allowing users to download and use the application as a realistic mIRC script app on Windows, macOS, and Linux.

## Date Created
2025-01-03

## Features

- **Cross-platform**: Supports Windows, macOS, and Linux
- **Native desktop experience**: Full-featured desktop application
- **Offline-capable**: Once built, the app can work offline (with Firebase connection when available)
- **Auto-updates**: Ready for auto-update implementation
- **Professional packaging**: Built-in installer and distribution formats

## Project Structure

```
electron/
├── main.js        # Main Electron process
└── preload.js     # Preload script for security

release/           # Built application distributions (gitignored)
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install Electron and electron-builder along with all other dependencies.

### 2. Development

To run the app in development mode:

```bash
npm run electron:dev
```

This will:
1. Build the Vite app
2. Launch Electron with the built app
3. Open DevTools automatically

### 3. Building for Production

#### Build for Current Platform

```bash
npm run electron:build
```

#### Build for Specific Platforms

**macOS:**
```bash
npm run electron:build:mac
```

**Windows:**
```bash
npm run electron:build:win
```

**Linux:**
```bash
npm run electron:build:linux
```

### 4. Build Outputs

All built applications will be in the `release/` directory:

- **macOS**: `.dmg` and `.zip` files
- **Windows**: `.exe` installer and `.zip` file
- **Linux**: `.AppImage`, `.deb`, and `.rpm` packages

## Configuration

### Electron Main Process

Located at `electron/main.js`:
- Window configuration (size, appearance)
- Menu bar setup
- Application lifecycle management
- Security settings (context isolation, node integration disabled)

### Electron Preload Script

Located at `electron/preload.js`:
- Secure IPC bridge between main and renderer processes
- Exposes safe APIs to the renderer process

### Build Configuration

Configured in `package.json` under the `build` key:

- **App ID**: `com.papatya.v7`
- **Product Name**: "Papatya mIRC Client"
- **Output Directory**: `release/`
- **Icon Configuration**: Uses icons from `public/assets/images/`

## Icon Requirements

The app uses icons from `public/assets/images/`:

- **Windows**: `icon.ico` (recommended: 256x256)
- **macOS**: `icon.icns` (needs to be created from PNG)
- **Linux**: `icon.png` (recommended: 512x512)

### Creating Icons

To create `.icns` for macOS:

1. Create a folder with PNG images of sizes: 16, 32, 64, 128, 256, 512, 1024
2. Use a tool like `iconutil` on macOS:
   ```bash
   iconutil -c icns icon.iconset -o icon.icns
   ```

Or use online tools like:
- [CloudConvert](https://cloudconvert.com/png-to-icns)
- [IconGenerator](https://www.iconfinder.com/icon-converter)

## Security Features

1. **Context Isolation**: Enabled for security
2. **Node Integration**: Disabled in renderer process
3. **Preload Script**: Secure bridge between processes
4. **Web Security**: Enabled to prevent XSS attacks

## Menu Bar

The app includes a native menu bar with:

- **File**: Quit
- **Edit**: Cut, Copy, Paste, Select All
- **View**: Reload, DevTools, Zoom controls, Fullscreen
- **Window**: Window management
- **Help**: About dialog

On macOS, the menu bar follows Apple's Human Interface Guidelines.

## Distribution

### Manual Distribution

After building, distribute the files from the `release/` directory:

- Share `.dmg` files for macOS
- Share `.exe` installers for Windows
- Share `.AppImage`, `.deb`, or `.rpm` for Linux

### Auto-Updates (Future Enhancement)

To implement auto-updates, consider using:
- [electron-updater](https://www.electron.build/auto-update) (recommended)
- Custom update server

## Troubleshooting

### Build Fails

1. Ensure all dependencies are installed: `npm install`
2. Build the web app first: `npm run build`
3. Check Node.js version (recommended: 18+)

### App Won't Start

1. Check console for errors: DevTools should open automatically in dev mode
2. Verify Firebase configuration is correct
3. Check that `dist/index.html` exists after building

### Icons Not Showing

1. Verify icon files exist in `public/assets/images/`
2. For macOS, ensure `.icns` file is properly formatted
3. Rebuild after adding/changing icons

## Performance Optimization

### Code Splitting

The React app uses code splitting with lazy loading, which works well in Electron.

### Asset Optimization

Vite automatically optimizes assets during build, including:
- Image optimization
- CSS minification
- JavaScript bundling and minification

## Development Tips

1. **Hot Reload**: In development, you can reload the Electron window with `Cmd/Ctrl + R`
2. **DevTools**: Automatically opens in development mode
3. **Console Logs**: Check both browser console and Electron console
4. **Build Size**: Monitor `release/` directory size to keep builds manageable

## Next Steps

1. Set up code signing for macOS and Windows
2. Implement auto-updates
3. Add crash reporting (e.g., Sentry)
4. Create installation instructions for users
5. Set up CI/CD for automated builds

## References

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder Documentation](https://www.electron.build/)
- [Vite Documentation](https://vitejs.dev/)

## Notes

- The app requires an internet connection to connect to Firebase services
- All Firebase functionality (chat, authentication, etc.) works the same as the web version
- The desktop app provides a more native experience with system integration

