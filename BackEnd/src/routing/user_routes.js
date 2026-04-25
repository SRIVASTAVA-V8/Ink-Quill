const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const routing = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const service = require('../service/controller');

// Create a new user
routing.post('/register', async (req, res) => {
    try {     
        const newUser = await service.registerUser(req.body);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error: error.message });
    }
});

routing.post('/login', async (req, res) => {
       const logindetails = req.body;
       try {
           const result = await service.loginUser(logindetails);
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
     res.status(200).json({ user: req.user });
   });



module.exports = routing;