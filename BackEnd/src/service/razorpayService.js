// services/razorpayService.js
const Razorpay = require('razorpay');
const crypto   = require('crypto');

let razorpayService={};

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Maps your payment method to Razorpay's method string
const METHOD_MAP = {
  upi:    'upi',
  card:   'card',
  wallet: 'wallet',
};

// Creates a Razorpay order — amount in paise
razorpayService.createRazorpayOrder = async (amount, internalOrderId, paymentMethod) => {
  return await razorpay.orders.create({
    amount:   Math.round(amount * 100),   // paise
    currency: 'INR',
    receipt:  `receipt_${internalOrderId}`,
    notes: {
      paymentMethod: METHOD_MAP[paymentMethod],
    },
  });
};

// Verifies Razorpay signature after frontend completes payment
razorpayService.verifySignature = (razorpayOrderId, razorpayPaymentId, signature) => {
  const body     = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  return expected === signature;
};

module.exports = razorpayService;