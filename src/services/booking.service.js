
const pool = require('../config/db.config');
const repo = require('../repositories/booking.repository');

exports.createBooking = async (payload, user) => {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const { property_id, start_date, end_date } = payload;

        // Lock property 
        await conn.query(
            `SELECT id FROM properties WHERE id = ? FOR UPDATE`,
            [property_id]
        );

        // Check overlap
        const conflict = await repo.checkDateConflict(
            property_id,
            start_date,
            end_date,
            conn
        );

        if (conflict) {
            throw new Error('Property already booked for selected dates');
        }

        // Calculate days
        const days =
            (new Date(end_date) - new Date(start_date)) /
            (1000 * 60 * 60 * 24);

        const [propertyRows] = await conn.query(
            `SELECT price_per_night FROM properties WHERE id = ?`,
            [property_id]
        );

        if (!propertyRows.length) throw new Error('Property not found');

        const total = days * propertyRows[0].price_per_night;

        const bookingId = await repo.createBooking(
            {
                user_id: user.id,
                property_id,
                start_date,
                end_date,
                total_amount: total
            },
            conn
        );

        await conn.commit();
        return { bookingId };

    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

exports.cancelBooking = async (id, user) => {
    const booking = await repo.findById(id);
    if (!booking) throw new Error('Booking not found');

    if (booking.user_id !== user.id)
        throw new Error('Unauthorized');

    if (booking.status === 'CONFIRMED')
        throw new Error('Cannot cancel confirmed booking');

    await repo.updateStatus(id, 'CANCELLED');
};

exports.getMyBookings = async (user) => {
    return await repo.getUserBookings(user.id);
};
