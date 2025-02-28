const express = require('express');
const cors = require('cors');
const _ = require('lodash');
const config = require('./config/env');
const { initializeDatabase } = require('./config/dbInit');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const loggerMiddleware = require('./middleware/loggerMiddleware');
const rateLimiter = require('./middleware/rateLimiterMiddleware');
const applySecurityMiddleware = require('./middleware/securityMiddleware');
const logger = require('./utils/logger');

// Initialize Express app
const app = express();

// Apply early middleware (logging, security headers)
app.use(loggerMiddleware);
applySecurityMiddleware(app);

// Request parsing middleware
app.use(express.json({ limit: '10kb' })); // Limit JSON body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.text({ limit: '10kb' }));

// CORS configuration
const corsOptions = {
  origin: config.env === 'production' ? config.corsOrigins : '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
};
app.use(cors(corsOptions));

// Apply rate limiting (only in production)
if (config.env === 'production') {
  app.use('/api', rateLimiter);
  logger.info('Rate limiting enabled for production environment');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    environment: config.env,
    timestamp: new Date()
  });
});

// Routes
app.use('/users', userRoutes);
app.use('/books', bookRoutes);

// 404 handler for undefined routes
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});

// Error handling middleware (always last)
app.use(errorMiddleware);

// Initialize database
(async () => {
  try {
    const success = await initializeDatabase();
    if (!success) {
      logger.warn('Database initialization had issues, but app will continue to run...');
    } else {
      logger.info('Database initialized successfully');
    }
  } catch (error) {
    logger.error('Database initialization error:', { error: error.message });
  }
})();

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', { error: err.message, stack: err.stack });
  
  // Graceful shutdown
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', { error: err.message, stack: err.stack });
  
  // Immediate shutdown for uncaught exceptions
  process.exit(1);
});

module.exports = app;