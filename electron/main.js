import { app, BrowserWindow, Menu, protocol } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Keep a global reference of the window object
let mainWindow;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Helper function to resolve paths correctly in both dev and production
const getAppPath = () => {
  return app.isPackaged ? app.getAppPath() : join(__dirname, '..');
};

// Register a protocol handler for better asset loading
function setupProtocol() {
  protocol.registerFileProtocol('app', (request, callback) => {
    const filePath = request.url.replace('app://', '');
    const decodedPath = decodeURIComponent(filePath);
    const fullPath = join(getAppPath(), decodedPath);
    callback({ path: fullPath });
  });
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#FFFFFF', // White to match app background
    webPreferences: {
      preload: join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      // In dev mode (HTTP), enable webSecurity; in production (file://), disable it for local file access
      webSecurity: isDev, // Enable webSecurity in dev, disable in production for file:// protocol
      allowRunningInsecureContent: !isDev, // Only allow insecure content in production for local files
      enableRemoteModule: false,
      sandbox: false, // Required for preload scripts
    },
    icon: process.platform === 'darwin'
      ? join(getAppPath(), 'public/assets/images/app-icon.icns')
      : process.platform === 'win32'
      ? join(getAppPath(), 'public/assets/images/favicon.ico')
      : join(getAppPath(), 'public/assets/images/android-chrome-512x512.png'),
    titleBarStyle: 'default', // Show standard title bar for window dragging
    frame: true,
    show: false, // Don't show until ready
  });

  // Load the app
  if (isDev) {
    // In development, load from Vite dev server
    mainWindow.loadURL('http://localhost:10000');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from built files
    // electron-builder packages files differently, so we need to check multiple paths
    let indexPath;

    if (app.isPackaged) {
      // In packaged app, unpacked files are in app.asar.unpacked
      // Try unpacked location first (where dist will be after asarUnpack)
      indexPath = join(process.resourcesPath, 'app.asar.unpacked/dist/index.html');
      if (!existsSync(indexPath)) {
        // Fallback to inside ASAR (if not unpacked)
        indexPath = join(process.resourcesPath, 'app/dist/index.html');
      }
      if (!existsSync(indexPath)) {
        // Final fallback to app path
        indexPath = join(getAppPath(), 'dist/index.html');
      }
    } else {
      // In development build (after vite build)
      indexPath = join(__dirname, '../dist/index.html');
    }

    if (existsSync(indexPath)) {
      // Use loadFile which handles path resolution better than loadURL
      mainWindow.loadFile(indexPath).catch(err => {
        console.error('Error loading file:', err);
        // Fallback to loadURL if loadFile fails
        const fileUrl = pathToFileURL(indexPath).href;
        mainWindow.loadURL(fileUrl);
      });
    } else {
      console.error('Cannot find dist/index.html. Please run "npm run build" first.');
      console.error('Tried paths:');
      console.error('  -', join(process.resourcesPath, 'app/dist/index.html'));
      console.error('  -', join(getAppPath(), 'dist/index.html'));
      console.error('  -', join(__dirname, '../dist/index.html'));
      console.error('App path:', getAppPath());
      console.error('Resources path:', process.resourcesPath);
    }
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // Focus the window
    if (isDev) {
      mainWindow.focus();
    }
  });

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  // Register protocol handler before creating window
  if (!app.isPackaged) {
    setupProtocol();
  }
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, applications and their menu bar typically stay active until
  // explicitly quit with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Create application menu
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => {
          app.quit();
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo', label: 'Undo' },
      { role: 'redo', label: 'Redo' },
      { type: 'separator' },
      { role: 'cut', label: 'Cut' },
      { role: 'copy', label: 'Copy' },
      { role: 'paste', label: 'Paste' },
      { role: 'selectAll', label: 'Select All' },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload', label: 'Reload' },
      { role: 'forceReload', label: 'Force Reload' },
      { role: 'toggleDevTools', label: 'Toggle Developer Tools' },
      { type: 'separator' },
      { role: 'resetZoom', label: 'Actual Size' },
      { role: 'zoomIn', label: 'Zoom In' },
      { role: 'zoomOut', label: 'Zoom Out' },
      { type: 'separator' },
      { role: 'togglefullscreen', label: 'Toggle Fullscreen' },
    ],
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize', label: 'Minimize' },
      { role: 'close', label: 'Close' },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About Papatya mIRC Client',
        click: () => {
          // This could open an about dialog in the future
        },
      },
    ],
  },
];

// macOS menu adjustments
if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about', label: 'About ' + app.getName() },
      { type: 'separator' },
      { role: 'services', label: 'Services' },
      { type: 'separator' },
      { role: 'hide', label: 'Hide ' + app.getName() },
      { role: 'hideOthers', label: 'Hide Others' },
      { role: 'unhide', label: 'Show All' },
      { type: 'separator' },
      { role: 'quit', label: 'Quit ' + app.getName() },
    ],
  });

  // Window menu
  template[4].submenu = [
    { role: 'close', label: 'Close' },
    { role: 'minimize', label: 'Minimize' },
    { role: 'zoom', label: 'Zoom' },
    { type: 'separator' },
    { role: 'front', label: 'Bring All to Front' },
  ];
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

