// src/repositories/admin.repository.js
const pool = require('../config/db.config');

exports.getDashboardStats = async () => {
    const [[users]] = await pool.query(
        `SELECT COUNT(*) AS totalUsers FROM users WHERE deleted_at IS NULL`
    );

    const [[properties]] = await pool.query(
        `SELECT COUNT(*) AS totalProperties FROM properties 
     WHERE deleted_at IS NULL`
    );

    const [[bookings]] = await pool.query(
        `SELECT COUNT(*) AS totalBookings FROM bookings 
     WHERE deleted_at IS NULL`
    );

    const [[revenue]] = await pool.query(
        `SELECT IFNULL(SUM(amount),0) AS totalRevenue 
     FROM payments 
     WHERE status='SUCCESS'`
    );

    return {
        totalUsers: users.totalUsers,
        totalProperties: properties.totalProperties,
        totalBookings: bookings.totalBookings,
        totalRevenue: revenue.totalRevenue
    };
};

exports.getPendingProperties = async () => {
    const [rows] = await pool.query(
        `SELECT id, title, city, created_at
     FROM properties
     WHERE status='PENDING'
     AND deleted_at IS NULL`
    );
    return rows;
};

exports.updatePropertyStatus = async (id, status) => {
    await pool.query(
        `UPDATE properties SET status = ?
     WHERE id = ?`,
        [status, id]
    );
};

exports.getAllUsers = async () => {
    const [rows] = await pool.query(
        `SELECT id, first_name, last_name, email, status
     FROM users
     WHERE deleted_at IS NULL`
    );
    return rows;
};

exports.updateUserStatus = async (id, status) => {
    await pool.query(
        `UPDATE users SET status = ?
     WHERE id = ?`,
        [status, id]
    );
};

exports.getMonthlyRevenue = async () => {
    const [rows] = await pool.query(
        `SELECT 
      DATE_FORMAT(created_at,'%Y-%m') AS month,
      SUM(amount) AS revenue
     FROM payments
     WHERE status='SUCCESS'
     GROUP BY month
     ORDER BY month ASC`
    );
    return rows;
};

exports.getBookingAnalytics = async () => {
    const [rows] = await pool.query(
        `SELECT status, COUNT(*) AS count
     FROM bookings
     GROUP BY status`
    );
    return rows;
};