const express = require('express');
const router = express.Router();
const { assignAgent, updateDeliveryStatus, getMyDeliveries } = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/assign', protect, authorize('admin'), assignAgent);
router.get('/my', protect, authorize('agent'), getMyDeliveries);
router.put('/:id/status', protect, authorize('agent', 'admin'), updateDeliveryStatus);

module.exports = router;
