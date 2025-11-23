/**
 * Stealth utilities for browser fingerprint management
 */

export interface BrowserProfile {
  userAgent: string;
  platform: string;
  vendor: string;
  language: string;
  languages: string[];
  hardwareConcurrency: number;
  deviceMemory: number;
  screenResolution: {
    width: number;
    height: number;
  };
  timezone: string;
  webgl: {
    vendor: string;
    renderer: string;
  };
}

/**
 * Generate realistic browser profiles
 */
export class StealthProfileGenerator {
  private static chromeVersions = ['119', '120', '121', '122'];
  private static platforms = [
    { name: 'Win32', os: 'Windows NT 10.0; Win64; x64' },
    { name: 'MacIntel', os: 'Macintosh; Intel Mac OS X 10_15_7' },
    { name: 'Linux x86_64', os: 'X11; Linux x86_64' },
  ];

  private static webglConfigs = [
    { vendor: 'Intel Inc.', renderer: 'Intel Iris OpenGL Engine' },
    { vendor: 'NVIDIA Corporation', renderer: 'NVIDIA GeForce GTX 1060/PCIe/SSE2' },
    { vendor: 'AMD', renderer: 'AMD Radeon Pro 5500M OpenGL Engine' },
  ];

  static generateProfile(): BrowserProfile {
    const chromeVersion = this.chromeVersions[Math.floor(Math.random() * this.chromeVersions.length)];
    const platform = this.platforms[Math.floor(Math.random() * this.platforms.length)];
    const webgl = this.webglConfigs[Math.floor(Math.random() * this.webglConfigs.length)];

    const userAgent = `Mozilla/5.0 (${platform.os}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion}.0.0.0 Safari/537.36`;

    return {
      userAgent,
      platform: platform.name,
      vendor: 'Google Inc.',
      language: 'en-US',
      languages: ['en-US', 'en'],
      hardwareConcurrency: [4, 8, 12, 16][Math.floor(Math.random() * 4)],
      deviceMemory: [4, 8, 16][Math.floor(Math.random() * 3)],
      screenResolution: {
        width: 1920,
        height: 1080,
      },
      timezone: 'America/New_York',
      webgl,
    };
  }

  /**
   * Windows 10 Chrome profile (most common)
   */
  static generateWindowsProfile(): BrowserProfile {
    const chromeVersion = '120';
    return {
      userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion}.0.0.0 Safari/537.36`,
      platform: 'Win32',
      vendor: 'Google Inc.',
      language: 'en-US',
      languages: ['en-US', 'en'],
      hardwareConcurrency: 8,
      deviceMemory: 8,
      screenResolution: {
        width: 1920,
        height: 1080,
      },
      timezone: 'America/New_York',
      webgl: {
        vendor: 'Intel Inc.',
        renderer: 'Intel Iris OpenGL Engine',
      },
    };
  }
}

/**
 * Cloudflare and Akamai specific bypass techniques
 */
export class AntiDetectionUtils {
  /**
   * Generate realistic HTTP headers for requests
   */
  static getStealthHeaders(): Record<string, string> {
    return {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'max-age=0',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
    };
  }

  /**
   * Mouse movement patterns for realistic behavior
   */
  static generateMouseMovements(duration: number): Array<{ x: number; y: number; timestamp: number }> {
    const movements: Array<{ x: number; y: number; timestamp: number }> = [];
    const startTime = Date.now();
    let x = Math.random() * 1920;
    let y = Math.random() * 1080;

    for (let i = 0; i < duration / 50; i++) {
      x += (Math.random() - 0.5) * 20;
      y += (Math.random() - 0.5) * 20;

      x = Math.max(0, Math.min(1920, x));
      y = Math.max(0, Math.min(1080, y));

      movements.push({
        x: Math.floor(x),
        y: Math.floor(y),
        timestamp: startTime + i * 50,
      });
    }

    return movements;
  }

  /**
   * Random delays to simulate human behavior
   */
  static async humanDelay(minMs: number = 100, maxMs: number = 500): Promise<void> {
    const delay = Math.floor(Math.random() * (maxMs - minMs) + minMs);
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Check if current environment has automation markers
   */
  static detectAutomation(): string[] {
    const markers: string[] = [];

    // Check for common automation indicators
    const checks = {
      webdriver: typeof (navigator as any).webdriver !== 'undefined',
      chrome: !(window as any).chrome || Object.keys((window as any).chrome).length === 0,
      permissions: typeof (navigator as any).permissions === 'undefined',
    };

    Object.entries(checks).forEach(([key, value]) => {
      if (value) markers.push(key);
    });

    return markers;
  }
}

/**
 * TLS fingerprint randomization
 */
export class TLSFingerprint {
  static readonly cipherSuites = [
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
  ];

  static readonly supportedVersions = ['TLS 1.2', 'TLS 1.3'];

  static generateFingerprint() {
    return {
      ciphers: this.cipherSuites,
      versions: this.supportedVersions,
      curves: ['X25519', 'prime256v1', 'secp384r1'],
      extensions: [
        'server_name',
        'extended_master_secret',
        'renegotiation_info',
        'supported_groups',
        'ec_point_formats',
        'session_ticket',
        'application_layer_protocol_negotiation',
        'status_request',
        'signature_algorithms',
        'signed_certificate_timestamp',
        'key_share',
        'psk_key_exchange_modes',
        'supported_versions',
        'compress_certificate',
        'application_settings',
      ],
    };
  }
}
