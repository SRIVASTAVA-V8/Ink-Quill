const express = require('express');
const routing = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const service = require('../service/order_service');
const validate_order = require('../middleware/validate_order');

routing.use(authMiddleware.validateToken);
routing.get('/history', async (req, res) => {
    const userId = req.user._id; // Get user ID from validated token
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const orders = await service.getOrderHistory(userId, page, limit);     
        res.status(200).json({ orders });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    } });
routing.get('/details/:orderId', authMiddleware.validateToken, async (req, res) => {
    const userId = req.user._id; // Get user ID from validated token
    const orderId = req.params.orderId;     
    try {
        const orderDetails = await service.getOrderDetails(userId, orderId);     
        res.status(200).json({ orderDetails });
    } catch (error) {           
        console.log(error);
        res.status(400).json({ message: error.message });
    }
    });

routing.get('/track/:orderId', async (req, res) => {
    const userId = req.user._id;
    const orderId = req.params.orderId;
    try {
        const tracking = await service.trackShipping(userId, orderId);
        res.status(200).json({ tracking });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

   routing.post('/checkout', validate_order, async (req, res) => {
    const userId = req.user._id;  
    const { paymentMethod, shippingAddress } = req.body; // Get payment and shipping details from request body
    try {
        const order = await service.checkout(userId, paymentMethod, shippingAddress);       
        return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order: {
        id:          order._id,
        totalAmount: order.totalAmount,
        orderStatus: order.orderStatus,
        placedAt:    order.placedAt,
      },
    });
    }
        catch (error) { 
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

routing.post('/verify-payment', async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await orderService.verifyPayment(
      req.user._id,
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );

    return res.json({
      success: true,
      message: 'Payment verified. Order confirmed.',
      order: {
        id:          order._id,
        totalAmount: order.totalAmount,
        orderStatus: order.orderStatus,
      },
    });

  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});
//── Payment failure (user closed popup / payment declined) ────────────────────
router.post('/payment-failed', async (req, res) => {
  try {
    const { orderId } = req.body;
    await orderService.handlePaymentFailure(req.user._id, orderId);
    return res.json({ success: true, message: 'Order marked as payment failed.' });

  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = routing;



