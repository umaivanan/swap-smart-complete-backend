const express = require('express');
const axios = require('axios');
const Payment = require('../models/Payment');  // Import the Payment schema
require('dotenv').config();
const router = express.Router();

// Create PayPal Order
router.post('/pay', async (req, res) => {
    const paymentData = {
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: '10.00'  // This should be dynamic based on your needs
            },
            description: 'Payment description'
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
            payer: {},  // Initially empty, filled later on capture
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

        // Step 2: Get PayPal Order details using the orderID
        const orderResponse = await axios.get(
            `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token/${orderID}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        res.json(orderResponse.data);  // Send the PayPal order details back to the frontend

    } catch (error) {
        console.error('Error fetching PayPal order:', error.response ? error.response.data : error);
        res.status(500).send('Error fetching PayPal order');
    }
});

module.exports = router;
