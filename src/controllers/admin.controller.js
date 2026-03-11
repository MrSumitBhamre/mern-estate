// src/controllers/admin.controller.js
const asyncHandler = require('../utils/asyncHandler.util');
const service = require('../services/admin.service');
const apiResponse = require('../utils/apiResponse.util');

exports.dashboard = asyncHandler(async (req, res) => {
    const data = await service.dashboard();
    return apiResponse.success(res, 'Dashboard stats fetched', data);
});

exports.pendingProperties = asyncHandler(async (req, res) => {
    const data = await service.pendingProperties();
    return apiResponse.success(res, 'Pending properties fetched', data);
});

exports.approveProperty = asyncHandler(async (req, res) => {
    await service.approveProperty(req.params.id);
    return apiResponse.success(res, 'Property approved');
});

exports.rejectProperty = asyncHandler(async (req, res) => {
    await service.rejectProperty(req.params.id);
    return apiResponse.success(res, 'Property rejected');
});

exports.users = asyncHandler(async (req, res) => {
    const data = await service.users();
    return apiResponse.success(res, 'Users fetched', data);
});

exports.blockUser = asyncHandler(async (req, res) => {
    await service.blockUser(req.params.id);
    return apiResponse.success(res, 'User blocked');
});

exports.monthlyRevenue = asyncHandler(async (req, res) => {
    const data = await service.monthlyRevenue();
    return apiResponse.success(res, 'Monthly revenue fetched', data);
});

exports.bookingAnalytics = asyncHandler(async (req, res) => {
    const data = await service.bookingAnalytics();
    return apiResponse.success(res, 'Booking analytics fetched', data);
});