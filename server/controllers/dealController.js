const Deal = require('../models/Deal');

exports.createDeal = async (req, res) => {
    try {
        const { title, description, category, city, price } = req.body;

        // Only sellers or both can create deals
        if (req.user.role === 'buyer') {
            return res.status(403).json({ success: false, error: 'Only sellers can create deals' });
        }

        const deal = await Deal.create({
            title,
            description,
            category,
            city,
            price,
            seller: req.user.id
        });

        res.status(201).json({ success: true, data: deal });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getDeals = async (req, res) => {
    try {
        const query = { status: 'created' }; // only show available deals by default

        if (req.query.city) query.city = req.query.city;
        if (req.query.category) query.category = req.query.category;

        const deals = await Deal.find(query).populate('seller', 'name email');
        res.json({ success: true, count: deals.length, data: deals });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getMyDeals = async (req, res) => {
    try {
        const deals = await Deal.find({
            $or: [{ seller: req.user.id }, { buyer: req.user.id }]
        }).populate('seller', 'name email').populate('buyer', 'name email');

        res.json({ success: true, count: deals.length, data: deals });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getDealById = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id)
            .populate('seller', 'name email')
            .populate('buyer', 'name email')
            .populate('escrowTransaction');

        if (!deal) {
            return res.status(404).json({ success: false, error: 'Deal not found' });
        }

        res.json({ success: true, data: deal });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updateDeal = async (req, res) => {
    try {
        let deal = await Deal.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({ success: false, error: 'Deal not found' });
        }

        if (deal.seller.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized to update this deal' });
        }

        if (deal.status !== 'created') {
            return res.status(400).json({ success: false, error: 'Cannot update deal after escrow is active' });
        }

        deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, data: deal });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.assignBuyer = async (req, res) => {
    try {
        let deal = await Deal.findById(req.params.id);

        if (!deal) return res.status(404).json({ success: false, error: 'Deal not found' });

        if (deal.status !== 'created') {
            return res.status(400).json({ success: false, error: 'Deal already has a buyer or is closed' });
        }

        if (deal.seller.toString() === req.user.id) {
            return res.status(400).json({ success: false, error: 'Seller cannot buy their own deal' });
        }

        deal.buyer = req.user.id;
        deal.status = 'awaiting_payment';
        await deal.save();

        res.json({ success: true, data: deal });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.scheduleMeetup = async (req, res) => {
    try {
        const { meetingLocation, meetingTime } = req.body;
        let deal = await Deal.findById(req.params.id);

        if (!deal) return res.status(404).json({ success: false, error: 'Deal not found' });

        // Only seller or buyer can schedule
        if (deal.seller.toString() !== req.user.id && deal.buyer?.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        deal.meetingLocation = meetingLocation;
        deal.meetingTime = meetingTime;
        if (deal.status === 'in_escrow') {
            deal.status = 'meetup_scheduled';
        }

        await deal.save();
        res.json({ success: true, data: deal });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.markHandedOver = async (req, res) => {
    try {
        let deal = await Deal.findById(req.params.id);

        if (!deal) return res.status(404).json({ success: false, error: 'Deal not found' });

        if (deal.seller.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Only seller can mark as handed over' });
        }

        if (!['in_escrow', 'meetup_scheduled'].includes(deal.status)) {
            return res.status(400).json({ success: false, error: 'Invalid operation for current state' });
        }

        deal.status = 'awaiting_buyer_confirmation';
        await deal.save();

        res.json({ success: true, data: deal });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
