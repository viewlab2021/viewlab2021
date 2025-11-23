"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
// Disable hardware acceleration for better stealth
electron_1.app.disableHardwareAcceleration();
// Command line switches for stealth
electron_1.app.commandLine.appendSwitch('disable-blink-features', 'AutomationControlled');
electron_1.app.commandLine.appendSwitch('disable-features', 'IsolateOrigins,site-per-process');
electron_1.app.commandLine.appendSwitch('disable-site-isolation-trials');
electron_1.app.commandLine.appendSwitch('disable-web-security');
electron_1.app.commandLine.appendSwitch('disable-features', 'BlockInsecurePrivateNetworkRequests');
// Remove Electron/Chrome automation flags
electron_1.app.commandLine.appendSwitch('enable-features', 'NetworkService,NetworkServiceInProcess');
let mainWindow = null;
function createWindow() {
    // Realistic window size (common desktop resolution)
    mainWindow = new electron_1.BrowserWindow({
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
        const popup = new electron_1.BrowserWindow({
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
electron_1.app.whenReady().then(async () => {
    // Modify headers to remove Electron traces
    electron_1.session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
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
    electron_1.session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        // Allow all permissions for realistic browser behavior
        callback(true);
    });
    // Disable cache for fresh fingerprint on each start
    await electron_1.session.defaultSession.clearCache();
    await electron_1.session.defaultSession.clearStorageData();
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
// Additional stealth measures
electron_1.app.on('web-contents-created', (event, contents) => {
    // Disable navigation to certain URLs that might detect automation
    contents.on('will-navigate', (event, navigationUrl) => {
        // Allow all navigation
    });
    // Inject stealth scripts before page load
    contents.on('did-finish-load', () => {
        // Page loaded, preload script has already run
    });
});
