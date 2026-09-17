const express = require('express');
const routing = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const service = require('../service/cart_service');

const public_routes    = [authMiddleware.optionalAuth, authMiddleware.validateGuestSession];
const protected_routes = [authMiddleware.validateToken];

routing.post('/add',...public_routes,async(req,res)=>{
    console.log('entered in routing...addToCart',req.body);
    const { bookId, quantity } = req.body;
    const userId = req.user ? req.user._id: null; // Get user ID if authenticated  
    const sessionId = req.sessionId;

    try {
         const cart= await service.addToCart(userId, sessionId, bookId, quantity);
         res.status(200).json({message: "Item Successfully added",cart});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }           
});

routing.get('',...public_routes,async(req,res)=>{
    console.log('entered in routing...getCart');
    
    const userId = req.user? req.user._id : null; // Get user ID if authenticated
    console.log(`userid: ${userId}`);
    const sessionId = req.sessionId;
    console.log(sessionId);

    try {   
        const cartItems = await service.getCart(userId, sessionId);
        res.status(200).json({ cartItems });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }  });

 routing.patch('/update',...public_routes,async(req,res)=>{
    console.log('entered in routing...updateCart',req.body);
    const { bookId, quantity } = req.body;
    const userId = req.user ? req.user._id : null; // Get user ID if authenticated
    const sessionId = req.sessionId;        
    try {
        const cart= await service.updateCart(userId, sessionId, bookId, quantity);
        res.status(200).json({message: "Cart updated successfully", cart});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }}); 
routing.delete('/remove',...public_routes,async(req,res)=>{
    console.log('entered in routing...removeCartItem',req.body);
    const { bookId } = req.body;
    const userId = req.user ? req.user._id : null; // Get user ID if authenticated
    const sessionId = req.sessionId;            
    try {
        const cart = await service.removeCartItem(userId, sessionId, bookId);
        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }});
routing.delete('/clear',...public_routes,async(req,res)=>{
    console.log('entered in routing...clearCart');
    const userId = req.user ? req.user._id : null;
    const sessionId = req.sessionId;  
    try {
        const cart = await service.clearCart(userId, sessionId);
        res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = routing;