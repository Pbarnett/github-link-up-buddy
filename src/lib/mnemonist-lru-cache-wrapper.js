// Temporary wrapper to fix the mnemonist/lru-cache import issue
// This provides a proper ESM default export for the CommonJS module
const LRUCache = require('mnemonist/lru-cache');
export default LRUCache;
