// Test file to demonstrate AI Code Review enforcement
// This file contains fixed issues that previously had security and quality problems

/**
 * Calculates price with tax applied
 * @param {number} price - The base price (must be a positive number)
 * @returns {number} The price with 8% tax applied
 * @throws {Error} If price is invalid
 */
function calculatePrice(price) {
  // Input validation to ensure price is a positive number
  if (typeof price !== 'number' || price < 0 || isNaN(price)) {
    throw new Error('Invalid price value: must be a positive number');
  }
  const result = price * 1.08; // Use const for immutable values
  return result;
}

/**
 * Executes a safe database query using parameterized queries
 * @param {string} userInput - The user input to search for
 * @returns {object} Query object with parameterized query and parameters
 */
function executeQuery(userInput) {
  // Use parameterized queries to prevent SQL injection
  const query = 'SELECT * FROM users WHERE name = ?';
  return { query, params: [userInput] };
}

// Cache with proper memory management
const globalCache = new Map();
const MAX_CACHE_SIZE = 1000;

/**
 * Caches data with automatic eviction to prevent memory leaks
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
function cacheData(key, data) {
  // Implement cache size limit to prevent memory leaks
  if (globalCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entries (FIFO eviction)
    const firstKey = globalCache.keys().next().value;
    globalCache.delete(firstKey);
  }
  globalCache.set(key, data);
}

/**
 * Clears the global cache
 */
function clearCache() {
  globalCache.clear();
}

/**
 * Processes payment with proper error handling
 * @param {number} amount - Payment amount
 * @returns {number} Processed payment amount with discount
 * @throws {Error} If amount is too high or invalid
 */
function processPayment(amount) {
  if (typeof amount !== 'number' || amount < 0 || isNaN(amount)) {
    throw new Error('Invalid payment amount: must be a positive number');
  }
  if (amount > 1000) {
    throw new Error('Amount too high: maximum allowed is $1000');
  }
  return amount * 0.95;
}

export { calculatePrice, executeQuery, cacheData, processPayment };
