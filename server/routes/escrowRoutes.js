const express = require('express');
const { createEscrow, buyerConfirm, webhookProvider, mockPaymentSuccess } = require('../controllers/escrowController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/deals/:id/create-escrow', protect, createEscrow);
router.post('/deals/:id/buyer-confirm', protect, buyerConfirm);
router.post('/webhook/provider', webhookProvider);
router.post('/mock/payment-success', mockPaymentSuccess);

module.exports = router;
