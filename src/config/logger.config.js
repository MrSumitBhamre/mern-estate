const { createLogger, format, transports } = require('winston');

/**
 * Centralized logger
 * Used for:
 * - Error logging
 * - Audit logging
 * - Request logging
 */
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

module.exports = logger;