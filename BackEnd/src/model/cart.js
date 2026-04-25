const mongoose = require('mongoose');
const cart=mongoose.Schema({
    userId: {                      // Reference to Users collection (null for guests)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    sessionId: String,           // For guest users (stored in cookies)
    items: [                     // Cart items
      {
        bookId: {                  // Reference to Books collection
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true
        },
        quantity: {              // Selected quantity
          type: Number,
          required: true,
          default: 1,
          min: 1
        },
        priceAtAddTime: Number // snapshot for consistency
      }
    ],
    totalAmount: Number,
    createdAt: {                 // Cart creation time
      type: Date,
      default: Date.now
    },
    updatedAt: Date              // Last modification time
  });

const Cart = mongoose.model("Cart", cart);

module.exports = Cart;