const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    orderID: {
        type: String,
        required: true
    },
    payer: {
        type: Object,
        required: true
    },
    amount: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
