// Test file to demonstrate AI Code Review enforcement
// This file contains intentional issues for testing

function calculatePrice(price) {
  // Missing input validation
  var result = price * 1.08; // Using var instead of const/let
  return result
} // Missing semicolon

// Potential security issue
function executeQuery(userInput) {
  const query = "SELECT * FROM users WHERE name = '" + userInput + "'"; // SQL injection risk
  return query;
}

// Memory leak potential
let globalCache = {};
function cacheData(key, data) {
  globalCache[key] = data; // Never cleared
}

// Poor error handling
function processPayment(amount) {
  if (amount > 1000) {
    throw "Amount too high"; // Throwing string instead of Error
  }
  return amount * 0.95;
}

export { calculatePrice, executeQuery, cacheData, processPayment };
