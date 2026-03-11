// src/repositories/property.repository.js

const pool = require('../config/db.config');

/**
 * CREATE PROPERTY
 */
exports.create = async (data) => {

    const {
        owner_id,
        title,
        slug,
        description,
        price_per_night,
        address,
        city,
        state,
        country,
        zip_code
    } = data;

    const [result] = await pool.query(
        `
        INSERT INTO properties
        (owner_id, title, slug, description, price_per_night,
         address, city, state, country, zip_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            owner_id,
            title,
            slug,
            description,
            price_per_night,
            address,
            city,
            state,
            country,
            zip_code
        ]
    );

    return result.insertId;
};


/**
 * FIND PROPERTY BY ID
 */
exports.findById = async (id) => {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM properties
        WHERE id = ?
        AND deleted_at IS NULL
        `,
        [id]
    );

    return rows[0];
};


/**
 * UPDATE PROPERTY
 */
exports.update = async (id, data) => {

    const fields = [];
    const values = [];

    if (data.title !== undefined) {
        fields.push("title = ?");
        values.push(data.title);
    }

    if (data.description !== undefined) {
        fields.push("description = ?");
        values.push(data.description);
    }

    if (data.price_per_night !== undefined) {
        fields.push("price_per_night = ?");
        values.push(data.price_per_night);
    }

    if (data.address !== undefined) {
        fields.push("address = ?");
        values.push(data.address);
    }

    if (data.city !== undefined) {
        fields.push("city = ?");
        values.push(data.city);
    }

    if (data.state !== undefined) {
        fields.push("state = ?");
        values.push(data.state);
    }

    if (data.country !== undefined) {
        fields.push("country = ?");
        values.push(data.country);
    }

    if (data.zip_code !== undefined) {
        fields.push("zip_code = ?");
        values.push(data.zip_code);
    }

    if (fields.length === 0) {
        throw new Error("No fields provided for update");
    }

    values.push(id);

    const query = `
        UPDATE properties
        SET ${fields.join(", ")},
            updated_at = NOW()
        WHERE id = ?
        AND deleted_at IS NULL
    `;

    const [result] = await pool.query(query, values);

    return result;
};


/**
 * SOFT DELETE PROPERTY
 */
exports.softDelete = async (id) => {

    await pool.query(
        `
        UPDATE properties
        SET deleted_at = NOW()
        WHERE id = ?
        `,
        [id]
    );

};


/**
 * GET ALL PROPERTIES
 */
exports.getAll = async (filters, limit, offset) => {

    let query = `
        SELECT *
        FROM properties
        WHERE deleted_at IS NULL
    `;

    const params = [];

    if (filters.city) {
        query += ` AND city = ?`;
        params.push(filters.city);
    }

    if (filters.minPrice) {
        query += ` AND price_per_night >= ?`;
        params.push(filters.minPrice);
    }

    query += `
        ORDER BY created_at DESC
        LIMIT ?
        OFFSET ?
    `;

    params.push(limit, offset);

    const [rows] = await pool.query(query, params);

    return rows;
};