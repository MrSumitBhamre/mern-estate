// src/services/property.service.js

const repo = require('../repositories/property.repository');

/**
 * Slug generator
 */
const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
};


/**
 * CREATE PROPERTY
 */
exports.createProperty = async (payload, user) => {

    const slug = `${slugify(payload.title)}-${Date.now()}`;

    const propertyId = await repo.create({
        owner_id: user.id,
        slug,
        ...payload
    });

    return propertyId;
};


/**
 * UPDATE PROPERTY
 */
exports.updateProperty = async (id, payload, user) => {

    const property = await repo.findById(id);

    if (!property) {
        throw new Error("Property not found");
    }

    if (property.owner_id !== user.id) {
        throw new Error("Unauthorized");
    }

    const result = await repo.update(id, payload);

    return result;
};


/**
 * DELETE PROPERTY (Soft Delete)
 */
exports.deleteProperty = async (id, user) => {

    const property = await repo.findById(id);

    if (!property) {
        throw new Error("Property not found");
    }

    if (property.owner_id !== user.id) {
        throw new Error("Unauthorized");
    }

    await repo.softDelete(id);

    return { message: "Property deleted successfully" };
};


/**
 * GET ALL PROPERTIES
 */
exports.getProperties = async (query) => {

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    const offset = (page - 1) * limit;

    return await repo.getAll(query, limit, offset);
};


/**
 * GET PROPERTY BY ID
 */
exports.getPropertyById = async (id) => {

    const property = await repo.findById(id);

    if (!property) {
        throw new Error("Property not found");
    }

    return property;
};