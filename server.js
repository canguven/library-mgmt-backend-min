const app = require('./app');
const config = require('./config/env');
const logger = require('./utils/logger');

const port = config.port;

const server = app.listen(port, () => {
  logger.info(`Server running in ${config.env} mode on port ${port}`);
});

// Handle graceful shutdown for SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated.');
  });
});

module.exports = server;