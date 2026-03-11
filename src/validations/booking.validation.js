// src/validations/booking.validation.js
const Joi = require('joi');

exports.createBookingSchema = Joi.object({
    property_id: Joi.number().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().greater(Joi.ref('start_date')).required()
});