const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    sessionId: String,           // For guest users (stored in cookies)
    items: [
        {
            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book",
                required: true
            },
            addedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
