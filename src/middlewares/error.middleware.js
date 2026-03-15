
const logger = require('../config/logger.config');

module.exports = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    data: {},
    meta: {}
  });
};
