const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../model/users');
const { v4: uuidv4 } = require('uuid');
dotenv.config();
 let authMiddleware = {};
 authMiddleware.validateToken = async (req, res, next) => {
    console.log('request payload',req);
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid token format.' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('_id name email role'); // Fetch user details from DB
        console.log(req.user);
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};
authMiddleware.validateGuestSession = async(req, res, next) => {
    console.log('entered in Validate Guest Session');
    
    if (req.user) {
        req.sessionId = null; // Authenticated users don't need a session ID
        return next(); // User is authenticated, proceed to the next middleware or route handler
    }
    let sessionId = req.cookies['sessionId'];
    if (!sessionId) {
        sessionId = uuidv4();
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('sessionId', sessionId, { httpOnly: true, secure: isProduction,sameSite: isProduction ? 'none' : 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 }); // 1 week
       console.log('New guest session created:', sessionId);
    } else {
        console.log('Existing guest session:', sessionId);
    }
    req.sessionId = sessionId;
    next();
}
authMiddleware.optionalAuth = async (req, res, next) => {
    console.log("=========== OPTIONAL AUTH =========");
    
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    console.log('Authorization Header:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Not valid Auth Header');      
      req.user = null; // Guest
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded JWT:', decoded);
    
    const user = await User.findById(decoded.userId).select('-password');
    console.log('Found user:', user);

    req.user = user || null;
    console.log('req.user assigned:',req.user);
    
  } catch (err) {
    console.error(
      'OPTIONAL AUTH ERROR:',
      err
    );
    
  console.log('===================================');
    req.user = null;
  }
  next();
};
authMiddleware.checkAdminRole = (req, res, next) => {
    console.log('CHecking Admin',req.user.role);
    if (req.user && req.user.role === 'admin') {
        return next();
    }   
    return res.status(403).json({ message: 'Admin access required.' });
};

module.exports = authMiddleware;