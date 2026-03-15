
const rateLimit = require('express-rate-limit');
const env = require('../config/env.config');

module.exports = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    data: {},
    meta: {}
  }
});
