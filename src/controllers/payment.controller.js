

const asyncHandler = require('../utils/asyncHandler.util');
const paymentService = require('../services/payment.service');
const apiResponse = require('../utils/apiResponse.util');

exports.createStripeIntent = asyncHandler(async (req, res) => {

    const intent = await paymentService.createStripeIntent(req.body);

    return apiResponse.success(
        res,
        'Stripe intent created',
        intent
    );

});
