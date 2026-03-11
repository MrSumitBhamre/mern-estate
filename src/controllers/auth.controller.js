// src/controllers/auth.controller.js
const asyncHandler = require('../utils/asyncHandler.util');
const service = require('../services/auth.service');
const apiResponse = require('../utils/apiResponse.util');

exports.register = asyncHandler(async (req, res) => {
    const data = await service.register(req.body);
    return apiResponse.success(res, 'User registered successfully', data);
});

exports.login = asyncHandler(async (req, res) => {
    const tokens = await service.login(req.body);
    return apiResponse.success(res, 'Login successful', tokens);
});