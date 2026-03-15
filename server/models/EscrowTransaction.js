const mongoose = require('mongoose');

const EscrowTransactionSchema = new mongoose.Schema({
    deal: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal', required: true },
    provider: { type: String, required: true }, // e.g., 'razorpayx', 'castler'
    providerTransactionId: { type: String },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
        type: String,
        enum: [
            'created',
            'payment_initiated',
            'payment_captured',
            'held_in_escrow',
            'release_initiated',
            'released',
            'refunded',
            'failed'
        ],
        default: 'created'
    },
    rawProviderResponse: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('EscrowTransaction', EscrowTransactionSchema);
