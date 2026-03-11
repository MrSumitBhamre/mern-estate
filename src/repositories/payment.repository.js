// src/repositories/payment.repository.js
const pool = require('../config/db.config');

exports.createPayment = async (data, conn) => {
    const {
        booking_id,
        payment_provider,
        provider_payment_id,
        amount,
        currency,
        status
    } = data;

    const [result] = await conn.query(
        `INSERT INTO payments
     (booking_id, payment_provider, provider_payment_id, amount, currency, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [booking_id, payment_provider, provider_payment_id, amount, currency, status]
    );

    return result.insertId;
};

exports.updatePaymentStatus = async (id, status, conn) => {
    await conn.query(
        `UPDATE payments SET status = ? WHERE id = ?`,
        [status, id]
    );
};

exports.createTransaction = async (payment_id, ref, response, conn) => {
    await conn.query(
        `INSERT INTO transactions
     (payment_id, transaction_ref, gateway_response)
     VALUES (?, ?, ?)`,
        [payment_id, ref, JSON.stringify(response)]
    );
};

exports.updateBookingStatus = async (booking_id, status, conn) => {
    await conn.query(
        `UPDATE bookings SET status = ? WHERE id = ?`,
        [status, booking_id]
    );
};