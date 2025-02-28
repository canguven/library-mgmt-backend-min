const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({
  path: path.join(__dirname, `../.env.${process.env.NODE_ENV || 'development'}`)
});

// Fallback to default .env file if environment-specific one doesn't exist
if (!process.env.DB_HOST) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

// Helper to parse string to array
const parseArray = (str) => {
  if (!str) return [];
  return str.split(',').map(item => item.trim());
};

// Configuration object with defaults
const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME || 'library_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
  // Security settings
  jwtSecret: process.env.JWT_SECRET || 'a-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  
  // CORS settings
  corsOrigins: parseArray(process.env.CORS_ORIGINS) || ['http://localhost:3000'],
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100 // limit each IP to 100 requests per windowMs
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')
  }
};

module.exports = config;