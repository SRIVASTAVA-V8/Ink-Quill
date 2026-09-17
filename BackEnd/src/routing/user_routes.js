const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const routing = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const service = require('../service/controller');
const cartService = require('../service/cart_service');
const wishlistService = require('../service/wishlist_service');
//const mergeCart= require ('../service/controller').mergeCart;

// Create a new user
routing.post('/register', async (req, res) => {
    try {     
        const newUser = await service.registerUser(req.body);
        const sessionId = req.cookies['sessionId'];
        if(sessionId)    { 
           await cartService.mergeCart(newUser.userId, sessionId);
           await wishlistService.mergeWishlist(newUser.userId, sessionId);
           res.clearCookie('sessionId');
           }
        const result = await service.loginUser({ email: req.body.email, password: req.body.password });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error: error.message });
    }
});

routing.post('/login', async (req, res) => {
       const logindetails = req.body;
       console.log("session id while logging ",req.cookies['sessionId']);
       
       try {
           const result = await service.loginUser(logindetails);    
           const sessionId = req.cookies['sessionId'];
           if(sessionId)    { 
           await cartService.mergeCart(result.user.userId, sessionId);
           await wishlistService.mergeWishlist(result.user.userId, sessionId);
           res.clearCookie('sessionId');
           }
           res.status(200).json(result);
       } catch (error) {
           console.log(error);
           res.status(400).json({ message: error.message });
       }
   });

  routing.post('/logout',async(req,res)=>{
    res.status(200).json({ message: 'User logged out successfully' });
  });


routing.get ('/profile',authMiddleware.validateToken, async (req, res) => {   
    try {
        const profile = await service.getProfile(req.user._id);
        res.status(200).json(profile);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }     
   });

module.exports = routing;