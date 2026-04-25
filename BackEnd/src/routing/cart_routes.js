const express = require('express');
const routing = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const service = require('../service/controller');

routing.post('/add',authMiddleware.validateGuestSession,async(req,res)=>{
    const { bookId, quantity } = req.body;
    const userId = req.user ? req.user.userId : null; // Get user ID if authenticated  
    const sessionId = req.sessionId;

    try {
         const cart= await service.addToCart(userId, sessionId, bookId, quantity);
         res.status(200).json({message: "Item Successfully added",result});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }           
});
 routing .get('/',authMiddleware.validateGuestSession,async(req,res)=>{
    const userId = req.user? req.user.userId : null; // Get user ID if authenticated
    const sessionId = req.sessionId;
    try {
        const cartItems = await service.getCart(userId, sessionId);
        res.status(200).json({ cartItems });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }  });

 routing.patch('/update',authMiddleware.validateGuestSession,async(req,res)=>{
    const { bookId, quantity } = req.body;
    const userId = req.user ? req.user.userId : null; // Get user ID if authenticated
    const sessionId = req.sessionId;        
    try {
        const cart= await service.updateCart(userId, sessionId, bookId, quantity);
        res.status(200).json({message: "Cart updated successfully", cart});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }}); 
routing.delete('/remove',authMiddleware.validateGuestSession,async(req,res)=>{
    const { bookId } = req.body;
    const userId = req.user ? req.user.userId : null; // Get user ID if authenticated
    const sessionId = req.sessionId;            
    try {
        const cart = await service.removeCartItem(userId, sessionId, bookId);
        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }});


module.exports = routing;