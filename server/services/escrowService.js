// Mock Escrow Service simulating an external API (e.g., RazorpayX Escrow)

exports.createEscrowTransaction = async (deal, buyer, seller) => {
    console.log(`[Escrow API] Creating transaction for Deal ${deal._id}`);

    // Simulated external API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const baseUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
    return {
        providerTransactionId: `mock_t_id_${Date.now()}`,
        paymentUrl: `${baseUrl}/mock-payment/${deal._id}`,
        status: 'payment_initiated'
    };
};

exports.capturePayment = async (providerTransactionId) => {
    console.log(`[Escrow API] Capturing payment ${providerTransactionId}`);
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        status: 'payment_captured'
    };
};

exports.releaseFunds = async (providerTransactionId) => {
    console.log(`[Escrow API] Releasing funds for ${providerTransactionId}`);
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        status: 'released'
    };
};

exports.handleWebhook = (payload) => {
    // Mock webhook signature verification would happen here
    console.log('[Escrow API] Processed webhook payload', payload);
    return true;
};
