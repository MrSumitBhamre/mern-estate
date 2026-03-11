const stripe = require('../config/stripe.config');
const repo = require('../repositories/payment.repository');
const pool = require('../config/db.config');   // ← ADD THIS


exports.handleStripeWebhook = async (req) => {

    // Temporary for Postman testing
    const event = req.body;

    if (event.type === 'payment_intent.succeeded') {

        const intent = event.data.object;
        const booking_id = intent.metadata.booking_id;

        const conn = await pool.getConnection();
        await conn.beginTransaction();

        try {

            const paymentId = await repo.createPayment({
                booking_id,
                payment_provider: 'STRIPE',
                provider_payment_id: intent.id,
                amount: intent.amount / 100,
                currency: intent.currency,
                status: 'SUCCESS'
            }, conn);

            await repo.createTransaction(
                paymentId,
                intent.id,
                intent,
                conn
            );

            await repo.updateBookingStatus(
                booking_id,
                'CONFIRMED',
                conn
            );

            await conn.commit();

        } catch (err) {

            await conn.rollback();
            throw err;

        } finally {

            conn.release();

        }
    }
};