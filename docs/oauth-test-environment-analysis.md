# OAuth Test Environment Analysis & Fixes

Based on the JSDOM API reference and the test failures, here are the key issues and their solutions:

## Current Issues

1. **JSDOM Environment Not Properly Initialized**: Window object not available in test setup
2. **Property Redefinition Errors**: Cannot redefine existing properties in JSDOM
3. **Global API Mocking Issues**: Modern web APIs not available in JSDOM by default

## Solutions from JSDOM API Reference

### 1. Proper JSDOM Configuration

The JSDOM API reference shows we need to configure the environment correctly with `pretendToBeVisual` and proper resource loading:

```javascript
// From JSDOM docs - proper configuration for modern web apps
const window = (new JSDOM(``, { 
  pretendToBeVisual: true,
  resources: 'usable',
  runScripts: 'outside-only',
  url: 'https://localhost:3000'
})).window;
```

### 2. Setting up Modern Browser APIs

According to the JSDOM documentation, we need to manually polyfill modern APIs:

```javascript
// From JSDOM docs - interfacing with Node.js vm module
const { Script } = require("vm");
const dom = new JSDOM(``, { runScripts: "outside-only" });
const script = new Script(`
  if (!this.crypto) {
    this.crypto = {
      getRandomValues: (arr) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      }
    };
  }
`);
const vmContext = dom.getInternalVMContext();
script.runInContext(vmContext);
```

### 3. Virtual Console for Error Handling

The JSDOM docs recommend using virtual console to capture errors:

```javascript
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => { /* handle jsdom errors */ });
const dom = new JSDOM(``, { virtualConsole });
```

### 4. Proper Cookie and Storage Setup

From the JSDOM API reference on cookie jars and storage:

```javascript
// Cookie jar setup
const cookieJar = new jsdom.CookieJar();
const dom = new JSDOM(``, { cookieJar });

// Storage should be configured automatically with proper URL
```

## Recommended Implementation

### Update vitest.config.ts

```typescript
export default defineConfig({
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'https://localhost:3000',
        pretendToBeVisual: true,
        resources: 'usable',  
        runScripts: 'outside-only'
      }
    }
  }
})
```

### Enhanced setupTests.ts

Focus on setting up polyfills in the global test setup rather than in individual tests:

```typescript
// Set up all modern browser APIs in setupTests.ts
beforeAll(() => {
  // Use JSDOM's vm context approach for global setup
  if (typeof window !== 'undefined') {
    // Set up crypto API
    if (!window.crypto) {
      Object.defineProperty(window, 'crypto', {
        value: {
          getRandomValues: (arr) => { /* implementation */ }
        },
        writable: true,
        configurable: true
      });
    }
    
    // Set up other APIs...
  }
});
```

### Test-Specific Modifications

For the OAuth test, avoid redefining properties and use proper mocking:

```typescript
beforeEach(() => {
  // Instead of redefining properties, delete and recreate
  if (window.google) {
    delete (window as any).google;
  }
  
  // Set up fresh mock
  (window as any).google = { accounts: mockGoogleAccounts };
});
```

## Key JSDOM Insights

1. **Use `runScripts: 'outside-only'`**: This enables modern JavaScript globals without security risks
2. **Enable `pretendToBeVisual`**: This makes JSDOM behave more like a real browser for OAuth flows  
3. **Set proper URL**: OAuth flows rely on proper origin/URL for security validation
4. **Use configurable properties**: Always set `configurable: true` when defining properties

## Testing OAuth-Specific Features

The JSDOM docs emphasize that for complex authentication flows:

1. Use proper URL setup for redirect validation
2. Mock `window.open` for popup flows
3. Set up proper storage APIs for token storage
4. Implement CustomEvent for OAuth callbacks

This approach follows the JSDOM documentation's guidance for "testing real-world web applications" with modern browser features.
