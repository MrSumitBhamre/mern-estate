
const express = require('express');
const router = express.Router();

const controller = require('../../controllers/booking.controller');
const auth = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { createBookingSchema } = require('../../validations/booking.validation');

router.post('/', auth, validate(createBookingSchema), controller.create);
router.get('/my', auth, controller.myBookings);
router.patch('/:id/cancel', auth, controller.cancel);

module.exports = router;
