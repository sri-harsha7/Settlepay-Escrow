const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    city: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: {
        type: String,
        enum: [
            'created',
            'awaiting_payment',
            'in_escrow',
            'meetup_scheduled',
            'awaiting_buyer_confirmation',
            'completed',
            'cancelled',
            'disputed'
        ],
        default: 'created'
    },
    meetingLocation: { type: String },
    meetingTime: { type: Date },
    escrowTransaction: { type: mongoose.Schema.Types.ObjectId, ref: 'EscrowTransaction', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Deal', DealSchema);
