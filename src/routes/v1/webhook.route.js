const express = require('express');
const router = express.Router();

const controller = require('../../controllers/webhook.controller');


router.post(
    '/stripe',
    express.raw({ type: 'application/json' }),
    controller.stripeWebhook
);

module.exports = router;
