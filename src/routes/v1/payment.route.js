const express = require('express');
const router = express.Router();

const paymentController = require('../../controllers/payment.controller');
const webhookController = require('../../controllers/webhook.controller');

const auth = require('../../middlewares/auth.middleware');

router.post('/stripe/intent', auth, paymentController.createStripeIntent);

router.post(
    '/stripe/webhook',
    express.raw({ type: 'application/json' }),
    webhookController.stripeWebhook
);

module.exports = router;