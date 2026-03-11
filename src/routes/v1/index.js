// src/routes/v1/index.js
const express = require('express');
const router = express.Router();

router.use('/health', require('./health.route'));
router.use('/auth', require('./auth.route'));
router.use('/properties', require('./property.route'));
router.use('/bookings', require('./booking.route'));
router.use('/payments', require('./payment.route'));
router.use('/webhooks', require('./webhook.route'));
router.use('/admin', require('./admin.route'));

module.exports = router;