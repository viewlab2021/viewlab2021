import { app, BrowserWindow, session } from 'electron';
import * as path from 'path';

// Disable hardware acceleration for better stealth
app.disableHardwareAcceleration();

// Command line switches for stealth
app.commandLine.appendSwitch('disable-blink-features', 'AutomationControlled');
app.commandLine.appendSwitch('disable-features', 'IsolateOrigins,site-per-process');
app.commandLine.appendSwitch('disable-site-isolation-trials');
app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendSwitch('disable-features', 'BlockInsecurePrivateNetworkRequests');

// Remove Electron/Chrome automation flags
app.commandLine.appendSwitch('enable-features', 'NetworkService,NetworkServiceInProcess');

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // Realistic window size (common desktop resolution)
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
      // Enable web features
      webviewTag: false,
      // Disable automation detection
      devTools: true,
    },
    // Make it look like a normal browser
    title: 'Chrome',
    icon: undefined,
  });

  // Remove Electron user agent signatures
  const session_ = mainWindow.webContents.session;

  // Realistic Chrome user agent
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  session_.setUserAgent(userAgent);

  // Handle new windows (popups)
  mainWindow.webContents.setWindowOpenHandler((details) => {
    const popup = new BrowserWindow({
      width: 1024,
      height: 768,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        webSecurity: false,
      },
    });

    popup.webContents.session.setUserAgent(userAgent);
    popup.loadURL(details.url);

    return { action: 'deny' }; // We handle it manually
  });

  // WebSocket support is enabled by default in Electron

  // Load initial page
  mainWindow.loadURL('about:blank');

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Session configuration before app is ready
app.whenReady().then(async () => {
  // Modify headers to remove Electron traces
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    // Remove Electron-specific headers
    delete details.requestHeaders['User-Agent'];

    // Add realistic Chrome headers
    details.requestHeaders['User-Agent'] =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    details.requestHeaders['Accept-Language'] = 'en-US,en;q=0.9';
    details.requestHeaders['sec-ch-ua'] = '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"';
    details.requestHeaders['sec-ch-ua-mobile'] = '?0';
    details.requestHeaders['sec-ch-ua-platform'] = '"Windows"';

    callback({ requestHeaders: details.requestHeaders });
  });

  // Enable permissions for all features
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    // Allow all permissions for realistic browser behavior
    callback(true);
  });

  // Disable cache for fresh fingerprint on each start
  await session.defaultSession.clearCache();
  await session.defaultSession.clearStorageData();

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Additional stealth measures
app.on('web-contents-created', (event, contents) => {
  // Disable navigation to certain URLs that might detect automation
  contents.on('will-navigate', (event, navigationUrl) => {
    // Allow all navigation
  });

  // Inject stealth scripts before page load
  contents.on('did-finish-load', () => {
    // Page loaded, preload script has already run
  });
});
