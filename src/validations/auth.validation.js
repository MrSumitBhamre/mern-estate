
const Joi = require('joi');

exports.registerSchema = Joi.object({
    first_name: Joi.string().min(2).max(100).required(),
    last_name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('USER', 'AGENT').required()
});

exports.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
