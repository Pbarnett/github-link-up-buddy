/**
 * Artillery processor for custom functions during load testing
 */

module.exports = {
  // Custom functions for processing during load tests
  
  // Log request/response for debugging
  logTransaction: function(requestParams, response, context, ee, next) {
    console.log(`Request: ${requestParams.method} ${requestParams.url}`);
    console.log(`Response status: ${response.statusCode}`);
    return next();
  },
  
  // Generate dynamic test data
  generateTestData: function(context, events, done) {
    // Set some dynamic variables for the virtual user
    context.vars.timestamp = Date.now();
    context.vars.userId = `user-${Math.random().toString(36).substr(2, 9)}`;
    return done();
  },
  
  // Custom response validation
  validateResponse: function(requestParams, response, context, ee, next) {
    if (response.statusCode >= 400) {
      console.log(`Error response: ${response.statusCode} for ${requestParams.url}`);
    }
    return next();
  }
};
