const mongoose = require('mongoose');

const DisputeSchema = new mongoose.Schema({
    deal: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal', required: true },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: ['open', 'in_review', 'resolved', 'closed'],
        default: 'open'
    },
    resolutionNote: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Dispute', DisputeSchema);
