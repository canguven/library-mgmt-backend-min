const logger = require('../utils/logger');
const _ = require('lodash');

const loggerMiddleware = (req, res, next) => {
  // Log request details
  const logData = {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  };

  // Add request body if it exists, but sanitize sensitive data
  if (!_.isEmpty(req.body)) {
    // Deep clone and sanitize if needed
    const sanitizedBody = _.cloneDeep(req.body);
    
    // Example of sanitizing sensitive fields (if any)
    if (sanitizedBody.password) {
      sanitizedBody.password = '[REDACTED]';
    }
    
    logData.body = sanitizedBody;
  }

  logger.info(`Incoming request`, logData);

  // Capture response
  const originalSend = res.send;
  res.send = function(data) {
    res.responseData = data;
    return originalSend.apply(res, arguments);
  };

  // Log after response is sent
  res.on('finish', () => {
    logger.info(`Response sent`, {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: Date.now() - req._startTime,
    });
  });

  // Set start time
  req._startTime = Date.now();
  next();
};

module.exports = loggerMiddleware;