const express = require('express');
const router = express.Router();

const controller = require('../../controllers/webhook.controller');

/**
 * Stripe requires raw body parsing
 * Do NOT apply auth middleware
 */
router.post(
    '/stripe',
    express.raw({ type: 'application/json' }),
    controller.stripeWebhook
);

module.exports = router;