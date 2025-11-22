# Electron Quick Start Guide

## 🚀 Quick Start

### Development

**Option 1: Fast Development with Hot Reload (Recommended)**

```bash
# Terminal 1: Start Vite dev server
npm run dev

# Terminal 2: Start Electron (connect to dev server)
npm run dev:electron
```

This gives you hot reload - changes appear instantly without rebuilding!

**Option 2: One Command**

```bash
npm run dev:full
```

This automatically starts both the dev server and Electron.

**Option 3: Production Build Testing**

```bash
npm run electron:dev
```

This builds first, then launches (slower, but tests actual production build).

For detailed development workflow, see: [ELECTRON_DEVELOPMENT.md](ELECTRON_DEVELOPMENT.md)

### Production Build

```bash
# Build for your current platform
npm run electron:build

# Or build for specific platforms:
npm run electron:build:mac     # macOS (.dmg, .zip)
npm run electron:build:win     # Windows (.exe, .zip)
npm run electron:build:linux   # Linux (.AppImage, .deb, .rpm)
```

Built applications will be in the `release/` directory.

## 📝 Notes

- Make sure to run `npm run build` before `npm run electron:build` if building manually
- The app requires internet connection for Firebase services
- All Firebase functionality works the same as the web version

## 🔧 Troubleshooting

### "Cannot find dist/index.html"

Make sure you've run `npm run build` first. The Electron app needs the built files.

### Icons Not Showing

For macOS, you need an `.icns` file. For Windows, you need an `.ico` file. Place them in `public/assets/images/`.

### Build Errors

1. Ensure all dependencies are installed: `npm install`
2. Check Node.js version (recommended: 18+)
3. For macOS builds on non-Mac machines, you'll need to build on a Mac

## 📚 Full Documentation

For detailed documentation, see: [docs/features/2025-01-03-electron-app-setup.md](docs/features/2025-01-03-electron-app-setup.md)

