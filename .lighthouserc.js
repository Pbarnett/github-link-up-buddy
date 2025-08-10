export default {
  ci: {
    collect: {
      // Explicitly disable staticDistDir so lhci doesn't auto-host ./dist
      staticDistDir: null,
      // Start Vite preview so SPA assets load correctly during the audit
      startServerCommand: 'npm run preview -- --port=4173 --strictPort',
      startServerReadyPattern: 'Local:\\s*http://.*:4173/',
      url: ['http://localhost:4173/'],
      numberOfRuns: 1,
      settings: {
        // Block external script that isn't needed for perf audits
        blockedUrlPatterns: ['*gptengineer.js*']
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-byte-weight': ['warn', { maxNumericValue: 350000 }],
        'script-treemap-data': 'off'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
