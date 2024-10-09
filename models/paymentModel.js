const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    payerEmail: {
        type: String,
        required: true,
    },
    instructorEmail: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    stripeId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Payment', PaymentSchema);
