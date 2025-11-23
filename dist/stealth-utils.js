"use strict";
/**
 * Stealth utilities for browser fingerprint management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TLSFingerprint = exports.AntiDetectionUtils = exports.StealthProfileGenerator = void 0;
/**
 * Generate realistic browser profiles
 */
class StealthProfileGenerator {
    static generateProfile() {
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
    static generateWindowsProfile() {
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
exports.StealthProfileGenerator = StealthProfileGenerator;
StealthProfileGenerator.chromeVersions = ['119', '120', '121', '122'];
StealthProfileGenerator.platforms = [
    { name: 'Win32', os: 'Windows NT 10.0; Win64; x64' },
    { name: 'MacIntel', os: 'Macintosh; Intel Mac OS X 10_15_7' },
    { name: 'Linux x86_64', os: 'X11; Linux x86_64' },
];
StealthProfileGenerator.webglConfigs = [
    { vendor: 'Intel Inc.', renderer: 'Intel Iris OpenGL Engine' },
    { vendor: 'NVIDIA Corporation', renderer: 'NVIDIA GeForce GTX 1060/PCIe/SSE2' },
    { vendor: 'AMD', renderer: 'AMD Radeon Pro 5500M OpenGL Engine' },
];
/**
 * Cloudflare and Akamai specific bypass techniques
 */
class AntiDetectionUtils {
    /**
     * Generate realistic HTTP headers for requests
     */
    static getStealthHeaders() {
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
    static generateMouseMovements(duration) {
        const movements = [];
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
    static async humanDelay(minMs = 100, maxMs = 500) {
        const delay = Math.floor(Math.random() * (maxMs - minMs) + minMs);
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    /**
     * Check if current environment has automation markers
     */
    static detectAutomation() {
        const markers = [];
        // Check for common automation indicators
        const checks = {
            webdriver: typeof navigator.webdriver !== 'undefined',
            chrome: !window.chrome || Object.keys(window.chrome).length === 0,
            permissions: typeof navigator.permissions === 'undefined',
        };
        Object.entries(checks).forEach(([key, value]) => {
            if (value)
                markers.push(key);
        });
        return markers;
    }
}
exports.AntiDetectionUtils = AntiDetectionUtils;
/**
 * TLS fingerprint randomization
 */
class TLSFingerprint {
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
exports.TLSFingerprint = TLSFingerprint;
TLSFingerprint.cipherSuites = [
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
];
TLSFingerprint.supportedVersions = ['TLS 1.2', 'TLS 1.3'];
