const { default: mongoose } = require('mongoose');
const dblayer = require('../model/controller');
const jwt = require('jsonwebtoken');

let service = {};
getOrCreateCart = async (userId, sessionId) => {
    try {
        const cart = await dblayer.getOrCreateCart(userId, sessionId);  
        return cart;
    } catch (error) {
        throw error;
    }};
calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + item.quantity * item.priceAtAddTime, 0);
};
service.mergeCart = async (userId, sessionId) => {
    console.log('Inside merge cart');
    
    try {
        const guestCart = await dblayer.getCart({ sessionId }); // Get guest cart using sessionId   
        if (!guestCart) return; // No guest cart to merge   
        const userCart = await dblayer.getCart({ userId }); // Get user cart using userId
        if (!userCart) {
            guestCart.userId = userId;      
            guestCart.sessionId = null; // Clear sessionId since it's now associated with a user
            await guestCart.save();
            return;
        }
        guestCart.items.forEach(guestItem => {
        const existingItem = userCart.items.find(
      item => item.bookId.toString() === guestItem.bookId.toString()
      );

      if (existingItem) {
      existingItem.quantity += guestItem.quantity;
      } else {
      userCart.items.push(guestItem);
      }
     });
        userCart.totalAmount = calculateTotalAmount(userCart.items);
        await userCart.save();
        await guestCart.deleteOne(); // Remove guest cart after merging
    } catch (error) {
        throw error;
    }};
service.addToCart = async (userId, sessionId, bookId, quantity) => {

    try{
        const query = userId
        ? { userId }
        : { sessionId };

    // Get the raw cart so bookId remains an ObjectId
         let cart = await dblayer.getCartRaw(query);
         if (!cart) {
         cart = await dblayer.getOrCreateCart(userId, sessionId );
         }
         const book = await dblayer.getBookById(bookId);
        if (!book) {
          throw new Error('Book not found' );
        }   
        const existingitem = cart.items.find(item => item.bookId.toString() === bookId);
        if (existingitem) {
          existingitem.quantity += Number(quantity);
        } else {
           cart.items.push({ bookId, quantity, priceAtAddTime: book.price });
        }
        cart.totalAmount = calculateTotalAmount(cart.items);
        await cart.save();
        return await dblayer.getCart(query); // Return the populated cart});
        }
    catch(error){
        throw error;
    }};
service.getCart = async (userId, sessionId) => {
    try {
        const cart = await dblayer.getOrCreateCart(userId, sessionId);
        return cart;
    } catch (error) {
        throw error;
    }};
service.updateCart = async (userId, sessionId, bookId, quantity) => {
    try {
        const query = userId ? { userId } : { sessionId };
        const cart=await dblayer.getCartRaw(query);
        if (!cart) {
         cart = await dblayer.getCart(query);
        }
        console.log(`cart in updateCart: ${cart}`);
        console.log(`bookid  in fetched cart ${cart.items[0].bookId}`);
        if (!cart) {
            throw new Error('Cart not found');
        }       
        const item= cart.items.find(item => item.bookId.toString() === bookId);
        if (!item) {
            throw new Error('Book not found in cart');
        }       
        item.quantity = Number(quantity);
        cart.totalAmount = calculateTotalAmount(cart.items);
        await cart.save();
        // Return populated cart
        return await dblayer.getCart(query);

    }
    catch (error) {
        throw error;
    }};
service.removeCartItem = async (userId, sessionId, bookId) => {
    try {
        const query = userId ? { userId } : { sessionId };
         const cart = await dblayer.getCartRaw(query);

    if (!cart) {
        throw new Error('Cart not found');
    }

    const originalLength = cart.items.length;
        cart.items = cart.items.filter(item => item.bookId.toString() !== bookId);
        if (cart.items.length === originalLength) {
        throw new Error('Book not found in cart');
    }
        cart.totalAmount = calculateTotalAmount(cart.items);
        await cart.save();
        return await dblayer.getCart(query);
    } catch (error) {
        throw error;
    }};
service.clearCart = async (userId, sessionId) => {
  const query = userId ? { userId } : { sessionId };

  const cart = await dblayer.getCartRaw(query);

  if (!cart) {
    return null;
  }

  cart.items = [];
  cart.totalAmount = 0;

  await cart.save();

  return await dblayer.getCart(query);
};  
module.exports = service;
