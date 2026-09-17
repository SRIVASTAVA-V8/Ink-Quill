const mongoose = require('mongoose');
const dblayer = require('../model/controller');
const razorpayService = require('./razorpayService');
const jwt = require('jsonwebtoken');
let orderService = {};
const SHIPPING_THRESHOLD = 500;
const SHIPPING_COST      = 50;
const TAX_RATE           = 0.18;

const buildStockBulkOps = (cartItems) => {
  return cartItems.map(({ book, quantity }) => ({
    updateOne: {
      filter: { _id: book._id, stock: { $gte: quantity } },
      update: { $inc: { stock: -quantity } },
    },
  }));
};

const buildOrderItems = (cartItems) => {
  return cartItems.map(({ book, quantity }) => ({
    book:       book._id,
    title:      book.title,       // snapshot — title/price locked at purchase
    coverImage: book.coverImage,
    price:      book.price,       // snapshot
    quantity,
  }));
};

const calculatePricing = (cartItems) => {
  const subtotal    = cartItems.reduce((sum, { book, quantity }) => sum + book.price * quantity, 0);
  const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax          = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const totalAmount  = parseFloat((subtotal + shippingCost + tax).toFixed(2));
  return { subtotal, shippingCost, tax, totalAmount };
};

const validateCartItems = (cartItems) => {
  for (const { book, quantity } of cartItems) {
    if (!book) {
      throw new Error('One or more books no longer exist');
    }
    if (book.stock < quantity) {
      throw new Error(`"${book.title}" only has ${book.stock} copies left`);
    }
  }
};

const decrementStockAndClearCart = async (bulkOps, cart, session) => {
  const stockResult = await dblayer.decrementStock(bulkOps, session);
  if (stockResult.modifiedCount !== bulkOps.length) {
    throw new Error('Stock changed during checkout. Please refresh your cart.');
  }
  await dblayer.clearCart(cart._id, session);
};


orderService.getOrderHistory = async (userId, page, limit) => {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
     dblayer.getOrdersByUserId(userId, page, limit, skip),
     dblayer.countOrdersByUser(userId),
  ]);
    return {
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }; 
};
orderService.getOrderDetails= async (userId, orderId) => {
    const order = await dblayer.getOrderDetails(userId,orderId);  
    if (!order) {
        throw new Error('Order not found');
    }   
    if (order.user.toString() !== userId.toString()) {
        throw new Error('Unauthorized access to order details');
    }
    return order;
};

orderService.trackShipping = async (userId, orderId) => {
    const order = await dblayer.getOrderDetails(userId, orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    if (order.user.toString() !== userId.toString()) {
        throw new Error('Unauthorized access to shipping information');
    }
    return {
        orderStatus: order.orderStatus,
        shippingInfo: order.shippingInfo || null,
        deliveredAt: order.deliveredAt || null,
    };
};

orderService.checkOut = async (userId, paymentMethod, shippingAddress) => {
    // This function will handle the checkout process, including creating an order, processing payment, and clearing the cart.
    // Implementation will depend on the specific requirements and payment gateway integration.
    const session=  await mongoose.startSession();
    try {
          let createdOrder;
          let razorpayOrder = null;
          session.startTransaction();
          // 1. Get user's cart
          const cart = await dblayer.getCart({ userId }, { session });
          if (!cart || cart.items.length === 0)
            {
             throw new Error('Cart is empty');
            }
          // 2. Validate cart items 
          validateCartItems(cart.items);
          // 3. Build order items and calculate pricing
          const orderItems = buildOrderItems(cart.items);
          const bulkOps    = buildStockBulkOps(cart.items);
          const pricing    = calculatePricing(cart.items);
    
          // 5. Create order
           createdOrder = await dblayer.createOrder({
            user: userId,
            items: orderItems,
            shippingAddress,
            ...pricing,
           paymentInfo: {
              method: paymentMethod, // This should be replaced with actual payment method details
              status: 'pending',       // Update based on payment gateway response
           },
           orderStatus: 'placed',
          confirmedAt:   new Date()}, session);

          if(paymentMethod === 'cod')
            {
            await decrementStockAndClearCart(bulkOps, cart, session);
            createdOrder.orderStatus = 'confirmed';
            createdOrder.confirmedAt = new Date();
            await createdOrder.save({ session });
            }
          else
            {
             // Razorpay methods (upi/card/wallet)
              // Stock decremented only AFTER payment verified — not here
             // Store bulkOps reference on order for use in verifyPayment
            // We do NOT touch stock yet — just create the Razorpay order 
              razorpayOrder = await razorpayService.createRazorpayOrder(
              pricing.totalAmount,
              createdOrder._id,
              paymentMethod,
              );

             createdOrder.razorpayOrderId = razorpayOrder.id;
             await createdOrder.save({ session });
             };

          if(paymentMethod === 'cod') 
            {
             return{
                paymentMethod:'cod',
                order:createdOrder,};
            }

          await session.commitTransaction();
          return{
              paymentMethod,
              order: createdOrder,
              razorpay:{
                orderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                keyId:    process.env.RAZORPAY_KEY_ID,
                 },
            };

        } 
        catch (error) {
            await session.abortTransaction();
            throw error;
        } 
        finally {
        await session.endSession();
        }
};
 orderService.verifyPayment = async(userId, orderId, razorpayOrderId, razorpayPaymentId,signature) => {
    // Verify Signature - pure Crypto
     const isValid= razorpayService.verifySignature(razorpayOrderId, razorpayPaymentId, signature);
      if(!isValid)
        {
            throw new Error('Invalid payment signature');
        };
     // fetch Order
        const order = await dblayer.getOrderDetails(orderId, userId);
        if(!order)
        {
            throw new Error('Order not found');
        };
      // guard  against double verification (network retries / double calls)
        if(order.paymentInfo.status === 'paid') return order; // Idempotent response
        const session = await mongoose.startSession();
        try{
            await session.startTransaction();
            const cart= await dblayer.getCart({ userId }, { session });
            const bulkOps= order.items.map(item=>({
              updateOne:{
               filter:{_id: item.book, stock: { $gte: item.quantity }},
               update:{ $inc: { stock: -item.quantity }},
            },}));
            await dblayer.decrementStock(bulkOps, session);
            if(cart) await dblayer.clearCart(cart._id, { session });
            await dblayer.confirmRazorpayPayment(orderId, razorpayOrderId, razorpayPaymentId, session);
            await session.commitTransaction();
            return await dblayer.getOrderById(orderId, userId); // Return updated order
        }
        catch(error){
            await session.abortTransaction();
            throw error;
        }
        finally{
            await session.endSession();
        }
    };
// Called if user closes Razorpay popup / payment fails on frontend
 orderService.handlePaymentFailure = async (userId, orderId) => {
  const order = await dblayer.getOrderDetails(orderId, userId);
  if (!order) throw new Error('Order not found');
  return await dblayer.markPaymentFailed(orderId);
};

     

module.exports = orderService;