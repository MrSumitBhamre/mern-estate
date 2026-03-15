

const repo = require('../repositories/property.repository');


const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
};



exports.createProperty = async (payload, user) => {

    const slug = `${slugify(payload.title)}-${Date.now()}`;

    const propertyId = await repo.create({
        owner_id: user.id,
        slug,
        ...payload
    });

    return propertyId;
};



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



exports.getProperties = async (query) => {

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    const offset = (page - 1) * limit;

    return await repo.getAll(query, limit, offset);
};

exports.getPropertyById = async (id) => {

    const property = await repo.findById(id);

    if (!property) {
        throw new Error("Property not found");
    }

    return property;
};
