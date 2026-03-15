const Deal = require('../models/Deal');
const EscrowTransaction = require('../models/EscrowTransaction');
const escrowService = require('../services/escrowService');

exports.createEscrow = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);
        if (!deal) return res.status(404).json({ success: false, error: 'Deal not found' });

        if (deal.buyer?.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Only the assigned buyer can initiate escrow' });
        }

        if (deal.status !== 'awaiting_payment') {
            return res.status(400).json({ success: false, error: 'Deal in invalid state for escrow creation' });
        }

        // Call mock provider
        const providerResponse = await escrowService.createEscrowTransaction(deal, req.user.id, deal.seller);

        const escrowTx = await EscrowTransaction.create({
            deal: deal._id,
            provider: 'mock_provider',
            providerTransactionId: providerResponse.providerTransactionId,
            buyer: req.user.id,
            seller: deal.seller,
            amount: deal.price,
            currency: deal.currency,
            status: 'payment_initiated',
            rawProviderResponse: providerResponse
        });

        deal.escrowTransaction = escrowTx._id;
        await deal.save();

        res.status(201).json({ success: true, data: escrowTx, paymentUrl: providerResponse.paymentUrl });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.buyerConfirm = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);
        if (!deal) return res.status(404).json({ success: false, error: 'Deal not found' });

        if (deal.buyer?.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Only buyer can confirm receipt' });
        }

        if (!['in_escrow', 'meetup_scheduled', 'awaiting_buyer_confirmation'].includes(deal.status)) {
            return res.status(400).json({ success: false, error: 'Cannot confirm in current state' });
        }

        const escrowTx = await EscrowTransaction.findById(deal.escrowTransaction);
        if (!escrowTx || escrowTx.status !== 'payment_captured') {
            return res.status(400).json({ success: false, error: 'No active payments to release' });
        }

        // Call Provider to release funds
        await escrowService.releaseFunds(escrowTx.providerTransactionId);

        escrowTx.status = 'released';
        await escrowTx.save();

        deal.status = 'completed';
        await deal.save();

        res.json({ success: true, message: 'Deal complete and funds released', data: deal });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.webhookProvider = async (req, res) => {
    try {
        const payload = req.body;
        // signature verification here...
        escrowService.handleWebhook(payload);

        // Simplistic mock webhook handling: Payment Capture
        if (payload.event === 'payment.captured') {
            const escrowTx = await EscrowTransaction.findOne({ providerTransactionId: payload.providerTransactionId });
            if (escrowTx && escrowTx.status === 'payment_initiated') {
                escrowTx.status = 'payment_captured';
                await escrowTx.save();

                const deal = await Deal.findById(escrowTx.deal);
                deal.status = 'in_escrow';
                await deal.save();
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Admin route to forcefully mock payment success
exports.mockPaymentSuccess = async (req, res) => {
    try {
        // This goes into the mock webhook handler
        req.body = {
            event: 'payment.captured',
            providerTransactionId: req.body.providerTransactionId
        };
        return exports.webhookProvider(req, res);
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}
