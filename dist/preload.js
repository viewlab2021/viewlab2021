"use strict";
/**
 * Preload script for stealth browser
 * Runs before page load to remove automation traces
 */
// This script runs in an isolated context, but can modify the window object
// before the page's JavaScript runs
const stealthScript = `
(function() {
  'use strict';

  // 1. Remove WebDriver property
  Object.defineProperty(navigator, 'webdriver', {
    get: () => undefined,
    configurable: true
  });

  // 2. Override Chrome automation properties
  if (window.navigator.chrome) {
    Object.defineProperty(window.navigator, 'chrome', {
      get: () => ({
        runtime: {},
        loadTimes: function() {},
        csi: function() {},
        app: {}
      }),
      configurable: true
    });
  }

  // 3. Override permissions query for notifications
  const originalQuery = window.navigator.permissions.query;
  window.navigator.permissions.query = function(parameters) {
    if (parameters.name === 'notifications') {
      return Promise.resolve({ state: Notification.permission });
    }
    return originalQuery.apply(this, arguments);
  };

  // 4. Override plugin array to look realistic
  Object.defineProperty(navigator, 'plugins', {
    get: () => [
      {
        0: {type: "application/x-google-chrome-pdf", suffixes: "pdf", description: "Portable Document Format"},
        description: "Portable Document Format",
        filename: "internal-pdf-viewer",
        length: 1,
        name: "Chrome PDF Plugin"
      },
      {
        0: {type: "application/pdf", suffixes: "pdf", description: "Portable Document Format"},
        description: "Portable Document Format",
        filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai",
        length: 1,
        name: "Chrome PDF Viewer"
      },
      {
        0: {type: "application/x-nacl", suffixes: "", description: "Native Client Executable"},
        1: {type: "application/x-pnacl", suffixes: "", description: "Portable Native Client Executable"},
        description: "",
        filename: "internal-nacl-plugin",
        length: 2,
        name: "Native Client"
      }
    ],
    configurable: true
  });

  // 5. Override languages
  Object.defineProperty(navigator, 'languages', {
    get: () => ['en-US', 'en'],
    configurable: true
  });

  // 6. Override platform
  Object.defineProperty(navigator, 'platform', {
    get: () => 'Win32',
    configurable: true
  });

  // 7. Override hardwareConcurrency to realistic value
  Object.defineProperty(navigator, 'hardwareConcurrency', {
    get: () => 8,
    configurable: true
  });

  // 8. Override deviceMemory
  Object.defineProperty(navigator, 'deviceMemory', {
    get: () => 8,
    configurable: true
  });

  // 9. Canvas fingerprinting protection
  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  const originalToBlob = HTMLCanvasElement.prototype.toBlob;
  const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

  // Add slight noise to canvas to prevent fingerprinting
  const addCanvasNoise = (canvas, context) => {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = imageData.data[i] + Math.floor(Math.random() * 3) - 1;
    }
    context.putImageData(imageData, 0, 0);
  };

  HTMLCanvasElement.prototype.toDataURL = function() {
    // Don't add noise to small canvases (likely not fingerprinting)
    if (this.width > 16 && this.height > 16) {
      const context = this.getContext('2d');
      if (context) {
        // Minimal noise to avoid breaking legitimate use
        const imageData = context.getImageData(0, 0, this.width, this.height);
        for (let i = 0; i < imageData.data.length; i += 100) {
          imageData.data[i] = imageData.data[i] ^ 1;
        }
        context.putImageData(imageData, 0, 0);
      }
    }
    return originalToDataURL.apply(this, arguments);
  };

  // 10. WebGL fingerprinting protection
  const getParameterProxyHandler = {
    apply: function(target, thisArg, args) {
      const param = args[0];
      const result = target.apply(thisArg, args);

      // Spoof common WebGL parameters used for fingerprinting
      if (param === 37445) { // UNMASKED_VENDOR_WEBGL
        return 'Intel Inc.';
      }
      if (param === 37446) { // UNMASKED_RENDERER_WEBGL
        return 'Intel Iris OpenGL Engine';
      }
      return result;
    }
  };

  const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
  WebGLRenderingContext.prototype.getParameter = new Proxy(
    originalGetParameter,
    getParameterProxyHandler
  );

  if (window.WebGL2RenderingContext) {
    const originalGetParameter2 = WebGL2RenderingContext.prototype.getParameter;
    WebGL2RenderingContext.prototype.getParameter = new Proxy(
      originalGetParameter2,
      getParameterProxyHandler
    );
  }

  // 11. Remove Automation-specific window properties
  delete window.cdc_adoQpoasnfa76pfcZLmcfl_Array;
  delete window.cdc_adoQpoasnfa76pfcZLmcfl_Promise;
  delete window.cdc_adoQpoasnfa76pfcZLmcfl_Symbol;

  // Remove other automation markers
  const automationMarkers = [
    '__webdriver_evaluate',
    '__selenium_evaluate',
    '__webdriver_script_function',
    '__webdriver_script_func',
    '__webdriver_script_fn',
    '__fxdriver_evaluate',
    '__driver_unwrapped',
    '__webdriver_unwrapped',
    '__driver_evaluate',
    '__selenium_unwrapped',
    '__fxdriver_unwrapped',
    '_Selenium_IDE_Recorder',
    '_selenium',
    'calledSelenium',
    '_WEBDRIVER_ELEM_CACHE',
    'ChromeDriverw',
    'driver-evaluate',
    'webdriver-evaluate',
    'selenium-evaluate',
    'webdriverCommand',
    'webdriver-evaluate-response',
    '__webdriverFunc',
    '__webdriver_script_fn',
    '__$webdriverAsyncExecutor',
    '__lastWatirAlert',
    '__lastWatirConfirm',
    '__lastWatirPrompt',
    '$chrome_asyncScriptInfo',
    '$cdc_asdjflasutopfhvcZLmcfl_'
  ];

  automationMarkers.forEach(marker => {
    delete window[marker];
  });

  // 12. Override Date.prototype.getTimezoneOffset for consistency
  const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;
  Date.prototype.getTimezoneOffset = function() {
    return 300; // EST timezone (can be randomized)
  };

  // 13. Battery API spoofing
  if (navigator.getBattery) {
    const originalGetBattery = navigator.getBattery;
    navigator.getBattery = async function() {
      const battery = await originalGetBattery.apply(this);
      Object.defineProperties(battery, {
        charging: { get: () => true },
        chargingTime: { get: () => 0 },
        dischargingTime: { get: () => Infinity },
        level: { get: () => 1.0 }
      });
      return battery;
    };
  }

  // 14. Screen resolution spoofing
  Object.defineProperties(screen, {
    width: { get: () => 1920 },
    height: { get: () => 1080 },
    availWidth: { get: () => 1920 },
    availHeight: { get: () => 1040 },
    colorDepth: { get: () => 24 },
    pixelDepth: { get: () => 24 }
  });

  // 15. Connection API spoofing
  if (navigator.connection) {
    Object.defineProperties(navigator.connection, {
      effectiveType: { get: () => '4g' },
      rtt: { get: () => 100 },
      downlink: { get: () => 10 },
      saveData: { get: () => false }
    });
  }

  // 16. Remove Electron-specific properties
  if (window.process && window.process.type === 'renderer') {
    delete window.process;
  }

  // 17. Mouse and touch events should be realistic
  // Ensure touch events are not available on desktop
  if (!('ontouchstart' in window)) {
    Object.defineProperty(window, 'ontouchstart', {
      get: () => undefined
    });
  }

  // 18. Add realistic error stack traces
  Error.stackTraceLimit = 10;

  // 19. Notification.permission realistic value
  try {
    Object.defineProperty(Notification, 'permission', {
      get: () => 'default'
    });
  } catch (e) {}

  // 20. Override toString methods to hide proxies
  const proxyToString = Function.prototype.toString;
  Function.prototype.toString = function() {
    if (this === navigator.permissions.query) {
      return 'function query() { [native code] }';
    }
    if (this === WebGLRenderingContext.prototype.getParameter) {
      return 'function getParameter() { [native code] }';
    }
    return proxyToString.apply(this, arguments);
  };

  // 21. Media devices enumeration
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    const originalEnumerateDevices = navigator.mediaDevices.enumerateDevices;
    navigator.mediaDevices.enumerateDevices = async function() {
      const devices = await originalEnumerateDevices.apply(this);
      // Return realistic device list
      return [
        { deviceId: 'default', kind: 'audioinput', label: 'Default - Microphone', groupId: 'group1' },
        { deviceId: 'default', kind: 'audiooutput', label: 'Default - Speaker', groupId: 'group2' },
        { deviceId: 'default', kind: 'videoinput', label: 'Integrated Camera', groupId: 'group3' }
      ];
    };
  }

  // 22. Speech synthesis
  if (window.speechSynthesis) {
    const originalGetVoices = window.speechSynthesis.getVoices;
    window.speechSynthesis.getVoices = function() {
      return [
        { name: 'Microsoft David Desktop - English (United States)', lang: 'en-US', default: true }
      ];
    };
  }

  // 23. Add Chrome's specific properties
  if (!window.chrome) {
    Object.defineProperty(window, 'chrome', {
      get: () => ({
        runtime: {},
        loadTimes: function() {
          return {
            commitLoadTime: Date.now() / 1000,
            connectionInfo: 'http/1.1',
            finishDocumentLoadTime: (Date.now() + 1000) / 1000,
            finishLoadTime: (Date.now() + 2000) / 1000,
            firstPaintAfterLoadTime: 0,
            firstPaintTime: (Date.now() + 500) / 1000,
            navigationType: 'Other',
            npnNegotiatedProtocol: 'unknown',
            requestTime: (Date.now() - 1000) / 1000,
            startLoadTime: (Date.now() - 500) / 1000,
            wasAlternateProtocolAvailable: false,
            wasFetchedViaSpdy: false,
            wasNpnNegotiated: false
          };
        },
        csi: function() {
          return {
            onloadT: Date.now(),
            pageT: Date.now() - 1000,
            startE: Date.now() - 2000,
            tran: 15
          };
        }
      }),
      configurable: true
    });
  }

  // 24. Iframe content window check bypass
  const originalContentWindow = Object.getOwnPropertyDescriptor(
    HTMLIFrameElement.prototype,
    'contentWindow'
  );

  if (originalContentWindow) {
    Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
      get: function() {
        const win = originalContentWindow.get.call(this);
        if (win) {
          // Apply stealth to iframe windows too
          try {
            Object.defineProperty(win.navigator, 'webdriver', {
              get: () => undefined
            });
          } catch(e) {}
        }
        return win;
      }
    });
  }

  // 25. Console.debug used by some detection scripts
  console.debug('Chrome is running in normal mode');

  console.log('[Stealth] All anti-detection measures applied');
})();
`;
// Inject the stealth script into the page context
window.addEventListener('DOMContentLoaded', () => {
    const script = document.createElement('script');
    script.textContent = stealthScript;
    script.type = 'text/javascript';
    (document.head || document.documentElement).appendChild(script);
    script.remove();
});
