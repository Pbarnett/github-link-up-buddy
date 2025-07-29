const { serviceTrackers } = require('../metrics/service-dependencies');

// Service URL patterns for automatic detection
const SERVICE_PATTERNS = {
  supabase: /supabase\.co/,
  launchdarkly: /app\.launchdarkly\.com|launchdarkly\.com/,
  stripe: /api\.stripe\.com/,
  // Add more patterns as needed
};

// Determine service name from URL
function getServiceFromUrl(url) {
  if (!url) return 'unknown';
  
  for (const [serviceName, pattern] of Object.entries(SERVICE_PATTERNS)) {
    if (pattern.test(url)) {
      return serviceName;
    }
  }
  
  return 'external';
}

// HTTP client interceptor for fetch API
function interceptFetch() {
  if (typeof global.fetch !== 'function') {
    console.warn('fetch is not available for interception');
    return;
  }

  const originalFetch = global.fetch;
  
  global.fetch = async function(url, options = {}) {
    const startTime = Date.now();
    const method = options.method || 'GET';
    const serviceName = getServiceFromUrl(url.toString());
    
    try {
      const response = await originalFetch(url, options);
      const duration = (Date.now() - startTime) / 1000; // Convert to seconds
      
      // Track the request
      if (serviceName === 'supabase') {
        serviceTrackers.supabase(method, duration, response.ok, response.status);
      } else if (serviceName === 'launchdarkly') {
        serviceTrackers.launchdarkly('evaluation', duration, response.ok, response.status);
      } else if (serviceName === 'stripe') {
        serviceTrackers.stripe(method, duration, response.ok, response.status);
      } else {
        serviceTrackers.external(serviceName, method, duration, response.ok, response.status);
      }
      
      return response;
    } catch (_error) {
      const duration = (Date.now() - startTime) / 1000;
      
      // Track failed request
      if (serviceName === 'supabase') {
        serviceTrackers.supabase(method, duration, false, 0);
      } else if (serviceName === 'launchdarkly') {
        serviceTrackers.launchdarkly('evaluation', duration, false, 0);
      } else if (serviceName === 'stripe') {
        serviceTrackers.stripe(method, duration, false, 0);
      } else {
        serviceTrackers.external(serviceName, method, duration, false, 0);
      }
      
      throw error;
    }
  };
  
  console.log('🔍 HTTP Fetch interceptor initialized for service dependency tracking');
}

// HTTP client interceptor for Node.js http/https modules
function interceptNodeHttp() {
  try {
    const http = require('http');
    const https = require('https');
    
    // Intercept http.request
    const originalHttpRequest = http.request;
    http.request = function(options, callback) {
      return trackNodeHttpRequest(originalHttpRequest, options, callback, 'http');
    };
    
    // Intercept https.request  
    const originalHttpsRequest = https.request;
    https.request = function(options, callback) {
      return trackNodeHttpRequest(originalHttpsRequest, options, callback, 'https');
    };
    
    console.log('🔍 Node.js HTTP/HTTPS interceptors initialized for service dependency tracking');
  } catch (error) {
    console.warn('Failed to initialize Node.js HTTP interceptors:', error.message);
  }
}

// Track Node.js http/https requests
function trackNodeHttpRequest(originalRequest, options, callback, protocol) {
  const startTime = Date.now();
  const url = typeof options === 'string' ? options : `${protocol}://${options.hostname || options.host}${options.path || '/'}`;
  const method = options.method || 'GET';
  const serviceName = getServiceFromUrl(url);
  
  const req = originalRequest(options, (res) => {
    const duration = (Date.now() - startTime) / 1000;
    const success = res.statusCode >= 200 && res.statusCode < 400;
    
    // Track the request
    if (serviceName === 'supabase') {
      serviceTrackers.supabase(method, duration, success, res.statusCode);
    } else if (serviceName === 'launchdarkly') {
      serviceTrackers.launchdarkly('evaluation', duration, success, res.statusCode);
    } else if (serviceName === 'stripe') {
      serviceTrackers.stripe(method, duration, success, res.statusCode);
    } else {
      serviceTrackers.external(serviceName, method, duration, success, res.statusCode);
    }
    
    if (callback) callback(res);
  });
  
  // Handle request errors
  req.on('error', (error) => {
    const duration = (Date.now() - startTime) / 1000;
    
    if (serviceName === 'supabase') {
      serviceTrackers.supabase(method, duration, false, 0);
    } else if (serviceName === 'launchdarkly') {
      serviceTrackers.launchdarkly('evaluation', duration, false, 0);
    } else if (serviceName === 'stripe') {
      serviceTrackers.stripe(method, duration, false, 0);
    } else {
      serviceTrackers.external(serviceName, method, duration, false, 0);
    }
  });
  
  return req;
}

// Axios interceptor (if axios is used)
function interceptAxios() {
  try {
    const axios = require('axios');
    
    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        config.metadata = { startTime: Date.now() };
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor
    axios.interceptors.response.use(
      (response) => {
        const duration = (Date.now() - response.config.metadata.startTime) / 1000;
        const serviceName = getServiceFromUrl(response.config.url);
        const method = response.config.method?.toUpperCase() || 'GET';
        
        if (serviceName === 'supabase') {
          serviceTrackers.supabase(method, duration, true, response.status);
        } else if (serviceName === 'launchdarkly') {
          serviceTrackers.launchdarkly('evaluation', duration, true, response.status);
        } else if (serviceName === 'stripe') {
          serviceTrackers.stripe(method, duration, true, response.status);
        } else {
          serviceTrackers.external(serviceName, method, duration, true, response.status);
        }
        
        return response;
      },
      (error) => {
        if (error.config && error.config.metadata) {
          const duration = (Date.now() - error.config.metadata.startTime) / 1000;
          const serviceName = getServiceFromUrl(error.config.url);
          const method = error.config.method?.toUpperCase() || 'GET';
          const statusCode = error.response?.status || 0;
          
          if (serviceName === 'supabase') {
            serviceTrackers.supabase(method, duration, false, statusCode);
          } else if (serviceName === 'launchdarkly') {
            serviceTrackers.launchdarkly('evaluation', duration, false, statusCode);
          } else if (serviceName === 'stripe') {
            serviceTrackers.stripe(method, duration, false, statusCode);
          } else {
            serviceTrackers.external(serviceName, method, duration, false, statusCode);
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    console.log('🔍 Axios interceptor initialized for service dependency tracking');
  } catch (_error) {
    // Axios not installed, skip
    console.log('ℹ️  Axios not available, skipping axios interceptor');
  }
}

// Initialize all interceptors
function initializeHttpInterceptors() {
  console.log('🚀 Initializing HTTP interceptors for service dependency tracking...');
  
  interceptFetch();
  interceptNodeHttp();
  interceptAxios();
  
  console.log('✅ HTTP interceptors initialized successfully');
}

module.exports = {
  initializeHttpInterceptors,
  getServiceFromUrl,
  SERVICE_PATTERNS
};
