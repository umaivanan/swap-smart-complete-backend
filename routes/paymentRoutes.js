const express = require('express');
const axios = require('axios');
const Payment = require('../models/Payment');  // Import the Payment schema
require('dotenv').config();
const router = express.Router();

// Create PayPal Order
router.post('/pay', async (req, res) => {
    const userEmail = req.session?.email || req.body.email;

    if (!userEmail) {
        return res.status(400).json({ error: 'User email is required for payment' });
    }

    const paymentData = {
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: '10.00'  // This can be dynamic based on your needs
            },
            description: `Payment for ${userEmail}`
        }]
    };

    try {
        // Step 1: Get Access Token from PayPal
        const tokenResponse = await axios.post(
            `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
            new URLSearchParams({
                grant_type: 'client_credentials'
            }).toString(),
            {
                auth: {
                    username: process.env.PAYPAL_CLIENT_ID,
                    password: process.env.PAYPAL_CLIENT_SECRET
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // Step 2: Create PayPal Order using the Access Token
        const orderResponse = await axios.post(
            `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
            paymentData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        const { id: orderID, links } = orderResponse.data;
        const approvalUrl = links.find(link => link.rel === 'approve').href;

        // Save the order in MongoDB
        const newPayment = new Payment({
            orderID,
            email: userEmail,
            payer: {},
            amount: paymentData.purchase_units[0].amount,
            status: 'Pending'
        });

        await newPayment.save();  // Save the payment in MongoDB

        res.json({ approvalUrl, orderID });

    } catch (error) {
        console.error('Error creating PayPal order:', error.response ? error.response.data : error);
        res.status(500).send('Error creating PayPal order');
    }
});

// Capture PayPal Order
router.get('/capture/:orderID', async (req, res) => {
    const { orderID } = req.params;

    try {
        // Step 1: Get Access Token from PayPal
        const tokenResponse = await axios.post(
            `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
            new URLSearchParams({
                grant_type: 'client_credentials'
            }).toString(),
            {
                auth: {
                    username: process.env.PAYPAL_CLIENT_ID,
                    password: process.env.PAYPAL_CLIENT_SECRET
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // Step 2: Capture the PayPal Order using the orderID
        const captureResponse = await axios.post(
            `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        // Extract necessary details from PayPal capture response
        const { payer, purchase_units } = captureResponse.data;
        const captureDetails = purchase_units[0].payments.captures[0];

        // Update payment in MongoDB after capture
        const updatedPayment = await Payment.findOneAndUpdate(
            { orderID },
            {
                payer: {
                    name: `${payer.name.given_name} ${payer.name.surname}`,
                    email_address: payer.email_address
                },
                status: 'Completed',
                captureDetails: captureDetails
            },
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        res.json({ message: 'Payment captured successfully', data: updatedPayment });

    } catch (error) {
        console.error('Error capturing PayPal order:', error.response ? error.response.data : error);
        res.status(500).send('Error capturing PayPal order');
    }
});

// Success route to handle the successful payment details
router.post('/success', async (req, res) => {
    const { email, paymentDetails } = req.body;

    if (!email || !paymentDetails || !paymentDetails.id) {
        return res.status(400).json({ error: 'Missing required payment details' });
    }

    try {
        // Extract necessary information from paymentDetails
        const orderID = paymentDetails.id;
        const payerName = `${paymentDetails.payer.name.given_name} ${paymentDetails.payer.name.surname}`;
        const payerEmail = paymentDetails.payer.email_address;
        const captureDetails = paymentDetails.purchase_units[0].payments.captures[0];

        // Find the payment by orderID and update it with captured details
        const updatedPayment = await Payment.findOneAndUpdate(
            { orderID },
            {
                payer: {
                    name: payerName,
                    email_address: payerEmail,
                },
                status: 'Completed',
                captureDetails: captureDetails
            },
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ error: 'Payment record not found' });
        }

        res.json({ message: 'Payment details saved successfully', payment: updatedPayment });
    } catch (error) {
        console.error('Error saving payment details:', error);
        res.status(500).json({ error: 'Error saving payment details' });
    }
});

module.exports = router;
