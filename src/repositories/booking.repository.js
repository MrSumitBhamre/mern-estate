// src/repositories/booking.repository.js
const pool = require('../config/db.config');

exports.checkDateConflict = async (property_id, start, end, conn) => {
    const [rows] = await conn.query(
        `SELECT id FROM bookings
     WHERE property_id = ?
     AND status IN ('PENDING','CONFIRMED')
     AND deleted_at IS NULL
     AND (
       (start_date <= ? AND end_date >= ?)
     )`,
        [property_id, end, start]
    );

    return rows.length > 0;
};

exports.createBooking = async (data, conn) => {
    const {
        user_id,
        property_id,
        start_date,
        end_date,
        total_amount
    } = data;

    const [result] = await conn.query(
        `INSERT INTO bookings
     (user_id, property_id, start_date, end_date, total_amount)
     VALUES (?, ?, ?, ?, ?)`,
        [user_id, property_id, start_date, end_date, total_amount]
    );

    return result.insertId;
};

exports.findById = async (id) => {
    const [rows] = await pool.query(
        `SELECT * FROM bookings
     WHERE id = ? AND deleted_at IS NULL`,
        [id]
    );
    return rows[0];
};

exports.updateStatus = async (id, status) => {
    await pool.query(
        `UPDATE bookings SET status = ?
     WHERE id = ?`,
        [status, id]
    );
};

exports.getUserBookings = async (user_id) => {
    const [rows] = await pool.query(
        `SELECT * FROM bookings
     WHERE user_id = ?
     AND deleted_at IS NULL
     ORDER BY created_at DESC`,
        [user_id]
    );

    return rows;
};