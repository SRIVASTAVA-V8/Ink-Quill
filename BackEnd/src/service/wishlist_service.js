const { default: mongoose } = require('mongoose');
const dblayer = require('../controller/controller');
const jwt = require('jsonwebtoken');

let service = {};

service.mergeWishlist = async (userId, sessionId) => {
    console.log('Inside merge wishlist');
    
    try {
        const guestWishlist = await dblayer.getWishlist({ sessionId }); // Get guest wishlist using sessionId
        if (!guestWishlist) return; // No guest wishlist to merge
        const userWishlist = await dblayer.getWishlist({ userId }); // Get user wishlist using userId
        if (!userWishlist) {
            guestWishlist.userId = userId;
            guestWishlist.sessionId = null; // Clear sessionId since it's now associated with a user
            await dblayer.updateWishlist(guestWishlist);
            return;
        }
        guestWishlist.items.forEach(guestItem => {
            const existingItem = userWishlist.items.find(
                item => item.bookId.toString() === guestItem.bookId.toString()
            );

            if (!existingItem) {
                userWishlist.items.push(guestItem);
            }
        });
        userWishlist.updatedAt = new Date();
        await dblayer.updateWishlist(userWishlist);
        await guestWishlist.deleteOne(); // Remove guest wishlist after merging
    } catch (error) {
        throw error;
    }};

// Wishlist service functions
service.getOrCreateWishlist = async (userId, sessionId) => {
    try {
        const wishlist = await dblayer.getOrCreateWishlist(userId, sessionId);  
        return wishlist;
    } catch (error) {
        throw error;
    }};

service.addToWishlist = async (userId, sessionId, bookId) => {
    try {
        const query = userId ? { userId } : { sessionId };
        let wishlist = await dblayer.getWishlistRaw(query);
        if (!wishlist) {
            wishlist = await service.getOrCreateWishlist(userId, sessionId);
        }
        const book = await dblayer.getBookById(bookId);
        if (!book) {
            throw new Error('Book not found');
        }
        
        const existingItem = wishlist.items.find(item => item.bookId.toString() === bookId.toString());
        if (existingItem) {
            throw new Error('Book already in wishlist');
        }
        
        wishlist.items.push({ bookId, addedAt: new Date() });
        wishlist.updatedAt = new Date();
        await dblayer.updateWishlist(wishlist);
        return await dblayer.getWishlist(query); // Return the updated wishlist with populated book details
    } catch (error) {
        throw error;
    }};

service.getWishlist = async (userId, sessionId,page, limit) => {
    try {
        const query = userId ? { userId } : { sessionId };
        const skip= (page - 1) * limit;
        const wishlist = await dblayer.getWishlist(query, page, limit, skip);
        return wishlist;
    } catch (error) {
        throw error;
    }};

service.removeFromWishlist = async (userId, sessionId, bookId) => {
    try {
        const query = userId ? { userId } : { sessionId };
        const wishlist = await dblayer.getWishlistRaw(query);
        if (!wishlist) {
            throw new Error('Wishlist not found');
        }
         const originalLength = wishlist.items.length;
        wishlist.items = wishlist.items.filter(item => item.bookId.toString() !== bookId.toString());
        if (wishlist.items.length === originalLength) {
        throw new Error('Book not found in wishlist');
    }
        wishlist.updatedAt = new Date();
        await dblayer.updateWishlist(wishlist);
        return await dblayer.getWishlist(query); // Return the updated wishlist with populated book details
    } catch (error) {
        throw error;
    }};
 isInWishlist = async (userId, sessionId, bookId) => {
    try {
        const query = userId ? { userId } : { sessionId };         
        const wishlist = await dblayer.getWishlistRaw(query);
        if (!wishlist) {
            return false;
        }
        
        return wishlist.items.some(item => item.bookId.toString() === bookId.toString());
    } catch (error) {
        throw error;
    }};

service.moveToCart = async (userId, sessionId, bookId) => {
    try {
        // Check if book is in wishlist
        const isInWishlist = await this.isInWishlist(userId, sessionId, bookId);
        if (!isInWishlist) {
            throw new Error('Book not found in wishlist');
        }

        // Add book to cart (quantity 1)
        const cart = await dblayer.addToCart(userId, sessionId, bookId, 1);

        // Remove book from wishlist
        const wishlist = await service.removeFromWishlist(userId, sessionId, bookId);

        return { cart, wishlist };
    } catch (error) {
        throw error;
    }};
service.clearWishlist = async (userId, sessionId) => {
  const query = userId ? { userId } : { sessionId };

  const wishlist = await dblayer.getWishlist(query);

  if (!wishlist) {
    return null;
  }

  wishlist.items = [];
  wishlist.updatedAt = new Date();

  await dblayer.updateWishlist(wishlist);

  return wishlist;
};
    module.exports = service;