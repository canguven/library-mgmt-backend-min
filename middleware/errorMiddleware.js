const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  // Log detailed error information
  logger.error(`Error in request processing: ${err.message}`, {
    error: err.name,
    stack: err.stack,
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body
  });
  
  // For Sequelize validation errors, provide more details
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const validationErrors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
      type: e.type
    }));
    
    logger.debug('Validation errors:', validationErrors);
    
    return res.status(400).json({
      message: 'Validation error',
      errors: validationErrors
    });
  }
  
  // Handle other types of errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // In production, don't expose error details for 500 errors
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
  
  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorMiddleware;