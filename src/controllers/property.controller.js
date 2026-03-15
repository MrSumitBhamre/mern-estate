
const asyncHandler = require('../utils/asyncHandler.util');
const service = require('../services/property.service');
const apiResponse = require('../utils/apiResponse.util');

exports.create = asyncHandler(async (req, res) => {
    const id = await service.createProperty(req.body, req.user);
    return apiResponse.success(res, 'Property created', { propertyId: id });
});

exports.update = asyncHandler(async (req, res) => {
    await service.updateProperty(req.params.id, req.body, req.user);
    return apiResponse.success(res, 'Property updated');
});

exports.delete = asyncHandler(async (req, res) => {
    await service.deleteProperty(req.params.id, req.user);
    return apiResponse.success(res, 'Property deleted');
});

exports.getAll = asyncHandler(async (req, res) => {
    const data = await service.getProperties(req.query);
    return apiResponse.success(res, 'Properties fetched', data);
});

exports.getById = asyncHandler(async (req, res) => {
    const data = await service.getPropertyById(req.params.id);
    return apiResponse.success(res, 'Property fetched', data);
});
