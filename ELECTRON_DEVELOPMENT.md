# Electron Development Workflow

## Quick Answer: Do I Need to Rebuild for Every Change?

**No!** You have several development options that don't require rebuilding:

## Development Options

### Option 1: Fast Development with Hot Reload (Recommended) ⚡

**Two-terminal approach:**

**Terminal 1:** Start the Vite dev server
```bash
npm run dev
```
This starts the web dev server at `http://localhost:10000` with hot reload.

**Terminal 2:** Start Electron (connect to dev server)
```bash
npm run dev:electron
```
This starts Electron and connects to the Vite dev server. Changes in your React code will hot-reload automatically!

**Benefits:**
- ✅ Fast - no building required
- ✅ Hot reload - see changes instantly
- ✅ DevTools always open
- ✅ Best development experience

### Option 2: One Command (Automatic)

**Single terminal:**
```bash
npm run dev:full
```
This runs both the Vite dev server AND Electron automatically. It waits for the dev server to be ready before launching Electron.

**Benefits:**
- ✅ One command to run everything
- ✅ Hot reload works
- ⚠️ All output in one terminal (can be messy)

### Option 3: Production Build Testing

Only use this when you want to test the **exact production build**:

```bash
npm run electron:dev
```
This builds the app first, then runs Electron with the built files.

**Use when:**
- Testing final production build
- Checking CSS/asset loading issues
- Verifying build process

## When to Rebuild for Distribution

Only rebuild the distribution package when you're ready to **share the app**:

```bash
npm run electron:build:mac     # For macOS
npm run electron:build:win     # For Windows
npm run electron:build:linux   # For Linux
```

## Development Workflow Summary

```
┌─────────────────────────────────────────┐
│   Normal Development (90% of time)      │
├─────────────────────────────────────────┤
│  Terminal 1: npm run dev                │
│  Terminal 2: npm run dev:electron       │
│                                         │
│  ✨ Edit code → See changes instantly   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│   Testing Production Build              │
├─────────────────────────────────────────┤
│  npm run electron:dev                   │
│                                         │
│  ⚠️ Slower, but tests actual build      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│   Creating Distribution Package         │
├─────────────────────────────────────────┤
│  npm run electron:build:mac             │
│                                         │
│  📦 Creates .dmg/.zip in release/      │
└─────────────────────────────────────────┘
```

## Tips

1. **For daily development:** Use Option 1 (two terminals)
2. **For quick testing:** Use Option 2 (one command)
3. **For final testing:** Use Option 3 (production build)
4. **For distribution:** Build only when ready to share

## Troubleshooting

**Electron shows blank screen:**
- Make sure `npm run dev` is running first
- Check that port 10000 is available
- Look at Electron console for errors

**Changes not appearing:**
- In dev mode, changes should hot-reload automatically
- Try refreshing the Electron window (Cmd+R / Ctrl+R)
- Check Vite dev server is running

**Want to test production build:**
- Use `npm run electron:dev` to test built version
- This helps catch issues that only appear in production

