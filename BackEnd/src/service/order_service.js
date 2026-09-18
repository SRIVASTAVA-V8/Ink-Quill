const mongoose = require('mongoose');
const dblayer = require('../model/controller');
const razorpayService = require('./razorpayService');

const orderService = {};

const SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 50;
const TAX_RATE = 0.18;


// -----------------------------------------
// STOCK OPERATIONS
// -----------------------------------------

const buildStockBulkOps = (cartItems) => {

  return cartItems.map(({ book, quantity }) => ({
    updateOne: {
      filter: {
        _id: book._id,
        stock: { $gte: quantity }
      },
      update: {
        $inc: {
          stock: -quantity
        }
      }
    }
  }));

};


// -----------------------------------------
// ORDER ITEM SNAPSHOT
// -----------------------------------------

const buildOrderItems = (cartItems) => {

  return cartItems.map(({ book, quantity }) => ({
    bookId: book._id,
    title: book.title,
    price: book.price,
    quantity
  }));

};


// -----------------------------------------
// PRICING
// -----------------------------------------

const calculatePricing = (cartItems) => {

  const subtotal = cartItems.reduce(
    (sum, { book, quantity }) =>
      sum + book.price * quantity,
    0
  );

  const deliveryCharges =
    subtotal >= SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_COST;

  const discount = 0;

  const tax = parseFloat(
    (subtotal * TAX_RATE).toFixed(2)
  );

  const total = parseFloat(
    (
      subtotal +
      deliveryCharges +
      tax -
      discount
    ).toFixed(2)
  );

  return {
    subtotal,
    discount,
    deliveryCharges,
    tax,
    total
  };

};


// -----------------------------------------
// CART VALIDATION
// -----------------------------------------

const validateCartItems = (cartItems) => {

  for (const { book, quantity } of cartItems) {

    if (!book) {
      throw new Error(
        'One or more books no longer exist'
      );
    }

    if (book.stock < quantity) {
      throw new Error(
        `"${book.title}" only has ${book.stock} copies left`
      );
    }

    if (quantity < 1) {
      throw new Error(
        'Invalid item quantity'
      );
    }
  }

};


// -----------------------------------------
// DECREASE STOCK + CLEAR CART
// -----------------------------------------

const decrementStockAndClearCart = async (
  bulkOps,
  cart,
  session
) => {

  const stockResult =
    await dblayer.decrementStock(
      bulkOps,
      session
    );

  if (
    stockResult.modifiedCount !==
    bulkOps.length
  ) {
    throw new Error(
      'Stock changed during checkout. Please refresh your cart.'
    );
  }

  await dblayer.clearCart(
    cart._id,
    session
  );

};


// -----------------------------------------
// ORDER HISTORY
// -----------------------------------------

orderService.getOrderHistory = async (
  userId,
  page,
  limit
) => {

  const skip = (page - 1) * limit;

  const [orders, total] =
    await Promise.all([
      dblayer.getOrdersByUserId(
        userId,
        page,
        limit,
        skip
      ),

      dblayer.countOrdersByUser(
        userId
      )
    ]);

  return {
    orders,

    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(
        total / limit
      )
    }
  };

};


// -----------------------------------------
// ORDER DETAILS
// -----------------------------------------

orderService.getOrderDetails = async (
  userId,
  orderId
) => {

  const order =
    await dblayer.getOrderDetails(
      userId,
      orderId
    );

  if (!order) {
    throw new Error(
      'Order not found'
    );
  }

  return order;

};


// -----------------------------------------
// TRACK SHIPPING
// -----------------------------------------

orderService.trackShipping = async (
  userId,
  orderId
) => {

  const order =
    await dblayer.getOrderDetails(
      userId,
      orderId
    );

  if (!order) {
    throw new Error(
      'Order not found'
    );
  }

  return {
    orderStatus: order.orderStatus,

    shippingInfo:
      order.shippingInfo || null,

    deliveredAt:
      order.deliveredAt || null
  };

};


// -----------------------------------------
// CHECKOUT
// -----------------------------------------

orderService.checkout = async (
  userId,
  paymentMethod,
  shippingAddress
) => {

  const session =
    await mongoose.startSession();

  try {

    let createdOrder;
    let razorpayOrder = null;

    await session.startTransaction();


    // 1. Get cart
    const cart =
      await dblayer.getCart(
        { userId },
        { session }
      );

    if (
      !cart ||
      cart.items.length === 0
    ) {
      throw new Error(
        'Cart is empty'
      );
    }


    // 2. Validate cart
    validateCartItems(
      cart.items
    );


    // 3. Build order data
    const orderItems =
      buildOrderItems(
        cart.items
      );

    const bulkOps =
      buildStockBulkOps(
        cart.items
      );

    const pricing =
      calculatePricing(
        cart.items
      );


    // 4. Create order
    createdOrder =
      await dblayer.createOrder(
        {
          userId,

          items: orderItems,

          shippingAddress,

          pricing,

          paymentInfo: {
            method: paymentMethod,
            status: 'pending'
          },

          orderStatus: 'placed'
        },

        session
      );


    // -----------------------------------
    // COD
    // -----------------------------------

    if (paymentMethod === 'cod') {

      await decrementStockAndClearCart(
        bulkOps,
        cart,
        session
      );

      createdOrder.paymentInfo.status =
        'pending';

      createdOrder.orderStatus =
        'processing';

      await createdOrder.save({
        session
      });


      await session.commitTransaction();


      return {
        paymentMethod: 'cod',

        order: createdOrder
      };
    }


    // -----------------------------------
    // RAZORPAY
    // -----------------------------------

    razorpayOrder =
      await razorpayService.createRazorpayOrder(
        pricing.total,
        createdOrder._id,
        paymentMethod
      );


    createdOrder.paymentInfo.razorpayOrderId =
      razorpayOrder.id;


    await createdOrder.save({
      session
    });


    await session.commitTransaction();


    return {

      paymentMethod,

      order: createdOrder,

      razorpay: {

        orderId:
          razorpayOrder.id,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency,

        keyId:
          process.env.RAZORPAY_KEY_ID
      }
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


// -----------------------------------------
// VERIFY RAZORPAY PAYMENT
// -----------------------------------------

orderService.verifyPayment = async (
  userId,
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
) => {


  // 1. Verify Razorpay signature
  const isValid =
    razorpayService.verifySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

  if (!isValid) {
    throw new Error(
      'Invalid payment signature'
    );
  }


  // 2. Find order
  const order =
    await dblayer.getOrderDetails(
      userId,
      orderId
    );

  if (!order) {
    throw new Error(
      'Order not found'
    );
  }


  // 3. Prevent duplicate verification
  if (
    order.paymentInfo.status ===
    'paid'
  ) {
    return order;
  }


  // 4. Make sure Razorpay order matches
  if (
    order.paymentInfo.razorpayOrderId !==
    razorpayOrderId
  ) {
    throw new Error(
      'Razorpay order mismatch'
    );
  }


  const session =
    await mongoose.startSession();


  try {

    await session.startTransaction();


    // 5. Build stock operations
    const bulkOps =
      order.items.map(item => ({

        updateOne: {

          filter: {
            _id: item.bookId,
            stock: {
              $gte: item.quantity
            }
          },

          update: {
            $inc: {
              stock: -item.quantity
            }
          }

        }

      }));


    // 6. Decrease stock
    const stockResult =
      await dblayer.decrementStock(
        bulkOps,
        session
      );


    if (
      stockResult.modifiedCount !==
      bulkOps.length
    ) {

      throw new Error(
        'Stock changed during payment. Please contact support.'
      );

    }


    // 7. Clear cart
    const cart =
      await dblayer.getCart(
        { userId },
        { session }
      );


    if (cart) {

      await dblayer.clearCart(
        cart._id,
        session
      );

    }


    // 8. Confirm payment
    await dblayer.confirmRazorpayPayment(
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      session
    );


    await session.commitTransaction();


    // 9. Return updated order
    return await dblayer.getOrderDetails(
      userId,
      orderId
    );

  }

  catch (error) {

    await session.abortTransaction();

    throw error;

  }

  finally {

    await session.endSession();

  }

};


// -----------------------------------------
// PAYMENT FAILURE
// -----------------------------------------

orderService.handlePaymentFailure =
  async (
    userId,
    orderId
  ) => {

    const order =
      await dblayer.getOrderDetails(
        userId,
        orderId
      );

    if (!order) {
      throw new Error(
        'Order not found'
      );
    }


    if (
      order.paymentInfo.status ===
      'paid'
    ) {
      return order;
    }


    return await dblayer.markPaymentFailed(
      orderId
    );

  };


module.exports = orderService;