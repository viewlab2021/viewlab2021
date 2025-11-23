# Undetectable Electron Browser

An Electron-based browser designed for security testing and research, with advanced anti-detection capabilities to bypass bot detection systems like Akamai and Cloudflare.

## ⚠️ Legal Notice

This tool is intended **ONLY** for:
- Authorized penetration testing
- Security research
- Educational purposes
- Testing your own applications

**Unauthorized use against systems you don't own or have permission to test is illegal.**

## 🎯 Features

### Anti-Detection Capabilities

1. **WebDriver Detection Bypass**
   - Removes `navigator.webdriver` property
   - Hides automation markers
   - Eliminates CDP (Chrome DevTools Protocol) traces

2. **Browser Fingerprint Normalization**
   - Realistic User-Agent strings
   - Natural navigator properties
   - Authentic plugin arrays
   - Proper timezone and language settings

3. **Canvas & WebGL Protection**
   - Canvas fingerprint randomization
   - WebGL vendor/renderer spoofing
   - Prevents fingerprinting attacks

4. **Automation Marker Removal**
   - Removes Selenium markers
   - Eliminates WebDriver indicators
   - Cleans up Chrome automation flags

5. **Full Browser Functionality**
   - ✅ Popup windows support
   - ✅ WebSocket connections
   - ✅ Full JavaScript API access
   - ✅ Cookie and session management
   - ✅ LocalStorage/SessionStorage
   - ✅ Service Workers
   - ✅ Web Workers

### HTTP Headers Spoofing

- Realistic Chrome headers
- Proper `sec-ch-ua` values
- Accept-Language normalization
- Sec-Fetch-* headers

## 📦 Installation

```bash
# Install dependencies
npm install

# Build TypeScript files
npm run build

# Run the browser
npm start
```

## 🚀 Usage

### Basic Usage

```bash
# Start the browser
npm start
```

The browser will open with a blank page. You can then navigate to any URL.

### Development Mode

```bash
# Run with DevTools open
NODE_ENV=development npm start
```

### Testing Anti-Detection

Open the test page to verify all stealth features:

```bash
# After starting the browser, load the test page
# File: test/detection-test.html
```

The test page includes:
- WebDriver detection test
- Chrome runtime test
- Navigator properties check
- Plugin detection
- Canvas fingerprinting test
- WebGL fingerprinting test
- Automation markers scan
- Popup window test
- WebSocket connection test

## 🛠️ Architecture

### Project Structure

```
.
├── src/
│   ├── main.ts           # Electron main process
│   ├── preload.ts        # Stealth injection script
│   └── stealth-utils.ts  # Fingerprint utilities
├── test/
│   └── detection-test.html  # Test suite
├── dist/                 # Compiled JavaScript
├── package.json
└── tsconfig.json
```

### Key Components

#### 1. Main Process (`main.ts`)

- Configures Electron with stealth settings
- Removes automation command-line flags
- Handles window creation and popup management
- Modifies HTTP headers to remove Electron traces

#### 2. Preload Script (`preload.ts`)

Injected before page load to:
- Override `navigator.webdriver`
- Modify canvas/WebGL fingerprints
- Remove automation markers
- Normalize browser properties

#### 3. Stealth Utils (`stealth-utils.ts`)

Provides:
- Browser profile generation
- Fingerprint randomization
- HTTP header spoofing
- Human behavior simulation

## 🔍 Anti-Detection Techniques

### 1. Navigator API Overrides

```javascript
Object.defineProperty(navigator, 'webdriver', {
  get: () => undefined
});
```

### 2. Chrome Runtime Simulation

```javascript
window.chrome = {
  runtime: {},
  loadTimes: function() { /* realistic data */ },
  csi: function() { /* realistic data */ }
};
```

### 3. Plugin Array Spoofing

Injects realistic Chrome plugin list:
- Chrome PDF Plugin
- Chrome PDF Viewer
- Native Client

### 4. Canvas Noise Injection

Adds minimal noise to canvas fingerprints to prevent tracking while maintaining functionality.

### 5. WebGL Spoofing

```javascript
gl.getParameter(UNMASKED_VENDOR_WEBGL)   // Returns: "Intel Inc."
gl.getParameter(UNMASKED_RENDERER_WEBGL) // Returns: "Intel Iris OpenGL Engine"
```

### 6. Automation Marker Removal

Removes 25+ automation detection markers including:
- `__webdriver_evaluate`
- `__selenium_evaluate`
- `cdc_adoQpoasnfa76pfcZLmcfl_*`
- `$chrome_asyncScriptInfo`

## 🧪 Testing

### Cloudflare Test

```javascript
// Navigate to a Cloudflare-protected site
// Should pass without challenge in most cases
```

### Akamai Test

```javascript
// Navigate to an Akamai-protected site
// Should behave like a normal browser
```

### Public Detection Tests

Test against public bot detection services:
- https://bot.sannysoft.com/
- https://arh.antoinevastel.com/bots/areyouheadless
- https://fingerprintjs.com/demo

## 📊 Comparison

| Feature | Regular Chrome | Selenium | Puppeteer | This Browser |
|---------|---------------|----------|-----------|--------------|
| navigator.webdriver | undefined | true | true | undefined |
| chrome object | ✓ | ✗ | ✗ | ✓ |
| Plugin array | ✓ | ✗ | ✗ | ✓ |
| Popup support | ✓ | Limited | Limited | ✓ |
| WebSocket | ✓ | ✓ | ✓ | ✓ |
| Automation markers | ✗ | ✓ | ✓ | ✗ |
| Canvas fingerprint | Stable | Stable | Stable | Randomized |

## 🔧 Configuration

### User-Agent Customization

Edit `src/stealth-utils.ts` to customize browser profiles:

```typescript
static generateWindowsProfile(): BrowserProfile {
  return {
    userAgent: 'Your custom user agent',
    platform: 'Win32',
    // ... other properties
  };
}
```

### Screen Resolution

Modify in `src/main.ts`:

```typescript
mainWindow = new BrowserWindow({
  width: 1920,
  height: 1080,
  // ...
});
```

## 🐛 Known Limitations

1. **TLS Fingerprinting**: Electron uses Chromium's network stack, so TLS fingerprint matches Chromium
2. **Timezone**: Currently hardcoded to America/New_York
3. **WebRTC Leaks**: Not fully protected against WebRTC IP leaks
4. **Font Fingerprinting**: Uses system fonts (detectable)

## 🛡️ Security Considerations

- This tool bypasses bot detection for legitimate testing purposes
- Always obtain proper authorization before testing
- Some detection systems may still identify the browser
- Regular updates needed as detection systems evolve

## 📝 Development

### Building

```bash
npm run build
```

### Cleaning

```bash
npm run clean
```

### Adding New Stealth Features

1. Add detection bypass logic to `src/preload.ts`
2. Test with `test/detection-test.html`
3. Verify against real bot detection systems

## 🤝 Contributing

This is a security research tool. Contributions should focus on:
- Improving anti-detection capabilities
- Adding new test cases
- Fixing compatibility issues
- Documentation improvements

## 📄 License

MIT License - See LICENSE file for details

## 🔗 Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Bot Detection Research](https://github.com/antoinevastel/fp-collect)
- [Canvas Fingerprinting](https://browserleaks.com/canvas)
- [WebGL Fingerprinting](https://browserleaks.com/webgl)

## ⚡ Quick Start

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Build
npm run build

# Run
npm start
```

Navigate to any website and it should behave like a normal Chrome browser while bypassing most bot detection systems.

---

**Remember**: Use responsibly and only on systems you're authorized to test.
