const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');
const config = require('../config/env');

// Create a rate limiter for the API
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 'error',
    message: `Too many requests from this IP, please try again after ${config.rateLimit.windowMs / (60 * 1000)} minutes`
  },
  keyGenerator: (req) => req.ip,
  handler: (req, res, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  }
});

module.exports = apiLimiter;