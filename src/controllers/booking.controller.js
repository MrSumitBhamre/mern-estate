// src/controllers/booking.controller.js
const asyncHandler = require('../utils/asyncHandler.util');
const service = require('../services/booking.service');
const apiResponse = require('../utils/apiResponse.util');

exports.create = asyncHandler(async (req, res) => {
    const data = await service.createBooking(req.body, req.user);
    return apiResponse.success(res, 'Booking created', data);
});

exports.cancel = asyncHandler(async (req, res) => {
    await service.cancelBooking(req.params.id, req.user);
    return apiResponse.success(res, 'Booking cancelled');
});

exports.myBookings = asyncHandler(async (req, res) => {
    const data = await service.getMyBookings(req.user);
    return apiResponse.success(res, 'Bookings fetched', data);
});