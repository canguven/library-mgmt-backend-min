const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');

// Apply security middleware
const applySecurityMiddleware = (app) => {
  // Set security HTTP headers
  app.use(helmet());
  
  // Prevent XSS attacks
  app.use(xss());
  
  // Prevent parameter pollution
  app.use(
    hpp({
      whitelist: [] // Add any parameters you want to allow duplicates for
    })
  );
};

module.exports = applySecurityMiddleware;