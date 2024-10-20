const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Add this line

const Payment = require('../models/paymentModel');

// Payment route
router.post('/', async (req, res) => {
    const { token, product, payer, payingTo } = req.body;

    try {
        // Create a charge using Stripe
        const charge = await stripe.charges.create({
            amount: product.price,
            currency: 'usd',
            description: product.name,
            source: token.id,
        });

        // Save payment details to MongoDB
        const newPayment = new Payment({
            payerEmail: payer,
            instructorEmail: payingTo,
            amount: product.price,
            productName: product.name,
            stripeId: charge.id, // Stripe charge ID
        });

        await newPayment.save();

        return res.status(200).json({ success: true, message: 'Payment successful', charge });
    } catch (error) {
        console.error('Payment error:', error);
        return res.status(500).json({ success: false, message: 'Payment failed', error });
    }
});

module.exports = router;
