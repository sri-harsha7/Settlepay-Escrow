const express = require('express');
const {
    createDeal,
    getDeals,
    getMyDeals,
    getDealById,
    updateDeal,
    assignBuyer,
    scheduleMeetup,
    markHandedOver
} = require('../controllers/dealController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getDeals)
    .post(protect, createDeal);

router.get('/mine', protect, getMyDeals);

router.route('/:id')
    .get(getDealById)
    .put(protect, updateDeal);

router.post('/:id/assign-buyer', protect, assignBuyer);
router.post('/:id/schedule-meetup', protect, scheduleMeetup);
router.post('/:id/mark-handed-over', protect, markHandedOver);

module.exports = router;
