const Delivery = require('../models/Delivery');
const Order = require('../models/Order');

// @desc    Assign agent to order
// @route   POST /api/deliveries/assign
// @access  Private (Admin)
exports.assignAgent = async (req, res) => {
    try {
        const { orderId, agentId } = req.body;

        // Create delivery record
        const delivery = await Delivery.create({
            orderId,
            agentId
        });

        // Update order status and agent
        await Order.findByIdAndUpdate(orderId, {
            status: 'confirmed',
            agentId: agentId
        });

        res.status(201).json({ success: true, data: delivery });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Update delivery status
// @route   PUT /api/deliveries/:id/status
// @access  Private (Agent)
exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updateData = { status };

        if (req.file) {
            updateData.deliveryPhoto = `/uploads/${req.file.filename}`;
        }

        let delivery = await Delivery.findById(req.params.id);
        
        if (status === 'delivered') {
            updateData.completedAt = Date.now();
            // Calculate earnings for this delivery
            updateData.earnings = 150 + Math.floor(Math.random() * 100);
        }
        
        // Always sync the main Order status with the Delivery status
        await Order.findByIdAndUpdate(delivery.orderId, { status: status });

        delivery = await Delivery.findByIdAndUpdate(req.params.id, updateData, { new: true });
        
        // Checklist #14: Emit Live Socket.io Event
        const io = req.app.get('io');
        if (io) {
            io.to(delivery.orderId.toString()).emit('order_status_update', {
                orderId: delivery.orderId.toString(),
                status: status
            });
        }
        
        res.status(200).json({ success: true, data: delivery });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get agent deliveries
// @route   GET /api/deliveries/my
// @access  Private (Agent)
exports.getMyDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find({ agentId: req.user.id }).populate('orderId');
        res.status(200).json({ success: true, data: deliveries });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
