const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const env = require('./config/env.config');

const rateLimiter = require('./middlewares/rateLimit.middleware');
const errorHandler = require('./middlewares/error.middleware');

const v1Routes = require('./routes/v1');

const app = express();

/**
 * Security Middlewares
 */
app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));

/**
 * Body Parser
 * IMPORTANT: Required for Stripe webhook signature verification
 */
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

/**
 * Rate Limiting
 */
app.use(rateLimiter);

/**
 * Versioned API Routing
 */
app.use('/api/v1', v1Routes);

/**
 * Centralized Error Handler
 */
app.use(errorHandler);

module.exports = app;