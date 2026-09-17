const express = require('express');
const routing = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const service = require('../service/wishlist_service');

const public_routes = [authMiddleware.optionalAuth, authMiddleware.validateGuestSession];

// Add book to wishlist
routing.post('/add', ...public_routes, async (req, res) => {
    console.log('entered in routing...addToWishlist', req.body);
    const { bookId } = req.body;
    const userId = req.user ? req.user._id : null;
    const sessionId = req.sessionId;

    try {
        const wishlist = await service.addToWishlist(userId, sessionId, bookId);
        res.status(200).json({ message: "Book added to wishlist", wishlist });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// Get wishlist
routing.get('', ...public_routes, async (req, res) => {
    const userId = req.user ? req.user._id : null;
    const sessionId = req.sessionId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const wishlist = await service.getWishlist(userId, sessionId,page, limit);
        res.status(200).json({ wishlist });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// Remove book from wishlist
routing.delete('/remove', ...public_routes, async (req, res) => {
    const { bookId } = req.body;
    const userId = req.user ? req.user._id : null;
    const sessionId = req.sessionId;

    try {
        const wishlist = await service.removeFromWishlist(userId, sessionId, bookId);
        res.status(200).json({ message: "Book removed from wishlist", wishlist });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});


// Move book from wishlist to cart
routing.post('/move-to-cart', ...public_routes, async (req, res) => {
    const { bookId } = req.body;
    const userId = req.user ? req.user._id : null;
    const sessionId = req.sessionId;

    try {
        const result = await service.moveToCart(userId, sessionId, bookId);
        res.status(200).json({ 
            message: "Book moved to cart successfully", 
            cart: result.cart,
            wishlist: result.wishlist
         });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});
routing.delete('/clear', ...public_routes, async (req, res) => {
  const userId = req.user ? req.user._id : null;
  const sessionId = req.sessionId;

  try {
    const wishlist = await service.clearWishlist(userId, sessionId);

    res.status(200).json({
      message: 'Wishlist cleared successfully',
      wishlist
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});



module.exports = routing;
