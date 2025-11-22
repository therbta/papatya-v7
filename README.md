# papatya-v7

A traditional mIRC system that adapted to web-based with React

## 🌐 Web Version

Demo Link: https://papatya-v7.vercel.app

## 🖥️ Desktop Application (Electron)

The app is also available as a desktop application for Windows, macOS, and Linux.

### Quick Start

**Development:**
```bash
npm install
npm run electron:dev
```

**Build for Production:**
```bash
# Build for current platform
npm run electron:build

# Or build for specific platforms
npm run electron:build:mac    # macOS
npm run electron:build:win    # Windows
npm run electron:build:linux  # Linux
```

Built applications will be in the `release/` directory.

### Documentation

For detailed Electron setup and configuration, see:
[Electron App Setup Documentation](docs/features/2025-01-03-electron-app-setup.md)

## Features

- Real-time IRC chat
- Traditional mIRC interface
- Firebase backend integration
- Cross-platform desktop support
- Modern React-based architecture
