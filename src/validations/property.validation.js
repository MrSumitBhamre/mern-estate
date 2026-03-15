
const Joi = require('joi');

exports.createPropertySchema = Joi.object({
    title: Joi.string().min(5).required(),
    description: Joi.string().min(20).required(),
    price_per_night: Joi.number().positive().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    zip_code: Joi.string().required()
});
