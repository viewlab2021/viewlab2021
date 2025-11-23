# Usage Guide

## Getting Started

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd viewlab2021

# Install dependencies
npm install

# Build the project
npm run build
```

### Running the Browser

```bash
# Start the browser
npm start
```

The browser will open with a blank page. You can navigate to any URL by modifying the code or implementing a URL bar.

## Advanced Usage

### Custom Navigation

To open a specific URL on startup, edit `src/main.ts`:

```typescript
// Replace this line:
mainWindow.loadURL('about:blank');

// With your desired URL:
mainWindow.loadURL('https://example.com');
```

### Testing Stealth Features

1. **Load the test page:**
   - After starting the browser, manually navigate to the test page
   - Or modify `src/main.ts` to load it automatically:

   ```typescript
   const testPath = `file://${path.join(__dirname, '../test/detection-test.html')}`;
   mainWindow.loadURL(testPath);
   ```

2. **Test against public detection services:**
   - https://bot.sannysoft.com/
   - https://arh.antoinevastel.com/bots/areyouheadless
   - https://fingerprintjs.com/demo
   - https://pixelscan.net/

### Cloudflare Testing

```typescript
// Navigate to a Cloudflare-protected site
mainWindow.loadURL('https://example-with-cloudflare.com');
```

Most Cloudflare challenges should pass without CAPTCHA. If you encounter issues:
- Ensure cookies are enabled
- Check that JavaScript is running
- Verify the User-Agent is realistic

### Akamai Testing

Akamai bot detection is more sophisticated. Tips for success:
- Use realistic mouse movements
- Add delays between requests
- Maintain consistent fingerprints
- Enable all browser features

### Customizing User-Agent

Edit `src/main.ts`:

```typescript
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';
```

Or use the profile generator from `src/stealth-utils.ts`:

```typescript
import { StealthProfileGenerator } from './stealth-utils';

const profile = StealthProfileGenerator.generateWindowsProfile();
session_.setUserAgent(profile.userAgent);
```

### Adding Automation Scripts

Create a new file `src/automation.ts`:

```typescript
import { BrowserWindow } from 'electron';

export async function automateTask(window: BrowserWindow) {
  // Wait for page to load
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Execute JavaScript in page context
  await window.webContents.executeJavaScript(`
    // Your automation code here
    document.querySelector('button').click();
  `);
}
```

Then import and use in `main.ts`:

```typescript
import { automateTask } from './automation';

mainWindow.webContents.on('did-finish-load', async () => {
  await automateTask(mainWindow);
});
```

## Common Scenarios

### Scenario 1: Login Automation

```typescript
mainWindow.webContents.executeJavaScript(`
  document.querySelector('#username').value = 'user';
  document.querySelector('#password').value = 'pass';
  document.querySelector('#login-button').click();
`);
```

### Scenario 2: Data Extraction

```typescript
const data = await mainWindow.webContents.executeJavaScript(`
  Array.from(document.querySelectorAll('.product')).map(el => ({
    title: el.querySelector('.title').textContent,
    price: el.querySelector('.price').textContent
  }));
`);
console.log(data);
```

### Scenario 3: Screenshot Capture

```typescript
const image = await mainWindow.webContents.capturePage();
require('fs').writeFileSync('screenshot.png', image.toPNG());
```

### Scenario 4: Cookie Management

```typescript
// Get cookies
const cookies = await session.defaultSession.cookies.get({});
console.log(cookies);

// Set cookie
await session.defaultSession.cookies.set({
  url: 'https://example.com',
  name: 'session',
  value: 'abc123'
});
```

## WebSocket Example

The browser fully supports WebSockets. Test with:

```javascript
const ws = new WebSocket('wss://echo.websocket.org/');

ws.onopen = () => {
  console.log('Connected');
  ws.send('Hello Server!');
};

ws.onmessage = (event) => {
  console.log('Received:', event.data);
};
```

## Popup Window Example

Popups work just like in a normal browser:

```javascript
// Open popup
const popup = window.open('https://example.com', '_blank', 'width=800,height=600');

// Check if popup was blocked
if (popup) {
  console.log('Popup opened');
} else {
  console.log('Popup blocked');
}
```

## Debugging

### Enable DevTools

Set environment variable before starting:

```bash
NODE_ENV=development npm start
```

Or programmatically in `src/main.ts`:

```typescript
mainWindow.webContents.openDevTools();
```

### Console Logging

Add logging in preload script:

```typescript
console.log('[Stealth] Feature applied');
```

View logs in DevTools Console.

### Checking Stealth Effectiveness

```javascript
// In DevTools Console
console.log('WebDriver:', navigator.webdriver);
console.log('Chrome:', window.chrome);
console.log('Plugins:', navigator.plugins.length);
```

## Performance Optimization

### Disable Unnecessary Features

```typescript
// In main.ts
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
```

### Memory Management

```typescript
// Clear cache periodically
await session.defaultSession.clearCache();
await session.defaultSession.clearStorageData();
```

## Security Notes

### Certificate Errors

The browser currently disables web security for testing. In production:

```typescript
// Remove these lines from main.ts:
webSecurity: false,
allowRunningInsecureContent: true,
```

### CORS Issues

CORS is currently disabled. Re-enable for production:

```typescript
webSecurity: true,
```

## Troubleshooting

### Issue: Bot still detected

**Solutions:**
1. Check User-Agent is realistic
2. Verify navigator properties are normal
3. Test canvas/WebGL fingerprints
4. Ensure no automation markers present
5. Use human-like delays between actions

### Issue: Popup blocked

**Solutions:**
1. Check popup handler in `main.ts`
2. Verify `setWindowOpenHandler` is configured
3. Test with `window.open()` directly

### Issue: WebSocket connection fails

**Solutions:**
1. Check WSS/WS protocol
2. Verify server endpoint is accessible
3. Check for CORS/security restrictions
4. Test with public echo server first

### Issue: TypeScript compilation errors

**Solutions:**
```bash
# Clean and rebuild
npm run clean
npm run build
```

### Issue: Electron won't start

**Solutions:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
npm start
```

## Best Practices

1. **Always test locally first**
   - Use test/detection-test.html
   - Verify all stealth features work

2. **Use realistic timing**
   - Add random delays
   - Don't make requests too fast

3. **Maintain consistent fingerprint**
   - Use same User-Agent throughout session
   - Keep navigator properties constant

4. **Respect robots.txt**
   - Check site policies
   - Follow rate limits

5. **Handle errors gracefully**
   - Add try-catch blocks
   - Implement retry logic

6. **Keep browser updated**
   - Update Electron regularly
   - Match latest Chrome version

## Advanced Configuration

### Custom Chrome Flags

```typescript
app.commandLine.appendSwitch('your-flag', 'value');
```

### Proxy Configuration

```typescript
await session.defaultSession.setProxy({
  proxyRules: 'http://proxy-server:port'
});
```

### Custom Headers

```typescript
session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
  details.requestHeaders['Custom-Header'] = 'value';
  callback({ requestHeaders: details.requestHeaders });
});
```

## Next Steps

- Implement URL bar UI
- Add bookmark system
- Create extension support
- Add proxy rotation
- Implement request throttling
- Add session management

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Bot Detection Tests](https://bot.sannysoft.com/)
- [Fingerprint Analysis](https://browserleaks.com/)
