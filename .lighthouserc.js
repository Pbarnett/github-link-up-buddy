module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4173'],
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 20000,
      numberOfRuns: 3,
      settings: {
        chromeFlags: ['--no-sandbox', '--headless'],
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Performance Budget
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        
        // Accessibility
        'color-contrast': 'error',
        'image-alt': 'error',
        'label': 'error',
        'tabindex': 'error',
        
        // Best Practices
        'is-on-https': 'error',
        'uses-responsive-images': 'warn',
        'efficient-animated-content': 'warn',
        
        // SEO
        'document-title': 'error',
        'meta-description': 'error',
        'http-status-code': 'error',
        
        // PWA (if applicable)
        'service-worker': 'off', // Disable if not using PWA
        'installable-manifest': 'off',
        
        // Custom Performance Budgets
        'resource-summary:document:size': ['error', { maxNumericValue: 50000 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 500000 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100000 }],
        'resource-summary:image:size': ['warn', { maxNumericValue: 1000000 }],
        'resource-summary:total:size': ['warn', { maxNumericValue: 2000000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlConnectionSsl: false,
        sqlConnectionUrl: 'sqlite:lhci.db',
      },
    },
    wizard: {
      preset: 'lighthouse:recommended',
    },
  },
};
