const express = require('express');
const Stripe = require('stripe');
const Payment = require('../models/Payment');  // Import the Payment model
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Route to handle the payment
router.post('/', async (req, res) => {
  const { token, product} = req.body;

  try {
    // Create a charge with Stripe
    const charge = await stripe.charges.create({
      amount: product.price,
      currency: 'usd',
      description: product.name,
      source: token.id,
    });
    

    // Save payment details to the database
    const payment = new Payment({
      productName: product.name,
      amount: product.price / 100,  // Convert to dollars
      stripeTransactionId: charge.id,
      customerEmail: token.email,
    });

    await payment.save();  // Save payment to MongoDB

    res.status(200).json({ success: true, message: 'Payment successful', charge });
  } catch (error) {
    console.error('Payment Error:', error);
    res.status(500).json({ success: false, message: 'Payment failed', error });
  }
});

module.exports = router;
