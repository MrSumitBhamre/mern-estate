const asyncHandler = require('../utils/asyncHandler.util');
const webhookService = require('../services/webhook.service');

exports.stripeWebhook = asyncHandler(async (req, res) => {

    await webhookService.handleStripeWebhook(req);

    res.status(200).json({
        success: true,
        message: 'Webhook processed'
    });

});