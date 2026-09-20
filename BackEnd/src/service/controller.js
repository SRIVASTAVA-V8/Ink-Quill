const { default: mongoose } = require('mongoose');
const dblayer = require('../controller/controller');
const jwt = require('jsonwebtoken');


let service = {};

service.registerUser = async (userData) => {
    const { name, email, password } = userData;

    // Validation
    if (!name || !email || !password) {
        throw new Error('Name, email, and password are required');
    }
    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }

    // Check if user exists
    const existingUser = await dblayer.findUserByEmail(email);
    if (existingUser) {
        throw new Error('Email already in use');
    }

    // Create new user
    const newUser = await dblayer.createUser({ name, email, password });
    return newUser;
};

service.loginUser = async (logindetails) => {
    const { email, password } = logindetails;  
      try{
        if (!email || !password) {          
            throw new Error('Email and password are required');    
        }
        const user = await dblayer.findUserByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }  
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }
        const payload = { userId: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { user: { userId: user.id, name: user.name, email: user.email, role: user.role }, token };
        // Merge guest cart with user cart after login
;
    }
    catch(error){
        throw error;    
    }
};
service.getProfile = async (userId) => {
    try {
        const user = await dblayer.getProfile(userId);           
        if (!user) {                
            throw new Error('User not found');
        }
    }
        catch (error) { 
        throw error;
    }}
;


module.exports = service ;
