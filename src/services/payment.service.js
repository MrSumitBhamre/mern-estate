const stripe = require('../config/stripe.config');
const pool = require('../config/db.config');
const repo = require('../repositories/payment.repository');



exports.createStripeIntent = async (booking_id) => {

    const [rows] = await pool.query(
        "SELECT * FROM bookings WHERE id = ?",
        [booking_id]
    );

    if (!rows.length) {
        throw new Error("Booking not found");
    }

    const booking = rows[0];

    const intent = await stripe.paymentIntents.create({
        amount: booking.total_amount * 100,
        currency: "inr",
        metadata: {
            booking_id: booking.id
        }
    });

    return intent;
};



exports.handleStripeWebhook = async (intent) => {

    const booking_id = intent.metadata.booking_id;

    const conn = await pool.getConnection();

    try {

        await conn.beginTransaction();

        const paymentId = await repo.createPayment({
            booking_id,
            payment_provider: "STRIPE",
            provider_payment_id: intent.id,
            amount: intent.amount / 100,
            currency: intent.currency,
            status: "SUCCESS"
        }, conn);

        await repo.createTransaction(
            paymentId,
            intent.id,
            intent,
            conn
        );

        await repo.updateBookingStatus(
            booking_id,
            "CONFIRMED",
            conn
        );

        await conn.commit();

    } catch (err) {

        await conn.rollback();
        throw err;

    } finally {

        conn.release();

    }

};
