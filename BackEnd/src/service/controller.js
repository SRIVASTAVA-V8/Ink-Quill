const dblayer = require('../model/controller');
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
        //return { user: { userId: user.id, name: user.name, email: user.email, role: user.role }, token };
        return { token };
    }
    catch(error){
        throw error;    
    }
};
        
service.getBooks= async({ collection, category, search, language, author, min_price, max_price, sortby ,exclude})=>{
    let warningMessage = null;
if (
  collection !== 'all' &&
  collection !== 'bestsellers' &&
  collection !== 'newarrivals' &&
  category &&
  category !== collection
) {
  warningMessage = "We couldn't find any Products for this Collection!";

  // REMOVE conflicting filter
  category = undefined;
}
    let filter={};
    if (collection !== 'all' && collection !== 'bestsellers' && collection !== 'newarrivals') {
      filter.category = collection;
    }
    if (category && !filter.category) {
        filter.category = category;
    }
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } },
            { tags: { $regex: search, $options: 'i' } }
        ];
    }
    if (language) {
        filter.language = language;
    }
    if (author) {
        filter.author = author;
    }
    if (min_price || max_price) {
        filter.price = {};
        if (min_price) filter.price.$gte = Number(min_price);
        if (max_price) filter.price.$lte = Number(max_price);
    }
    if (exclude) {
        filter._id = { $ne: exclude};
    }

    
    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      bestseller: { ratingAvg: -1, ratingCount: -1 },
      newest: { createdAt: -1 }
    };
    let sort = { createdAt: -1 };
    if (collection === 'bestsellers') {
        sort = sortMap.bestseller;
    } else if (collection === 'newarrivals') {
        sort = sortMap.newest;
    }
    if (sortby && sortMap[sortby]) {
        sort = sortMap[sortby];
    }   

    try{
        const books = await dblayer.getBooks(filter,sort);
        return {warningMessage, books};
    }
    catch(error){
        throw error;
    }

};

service.getBookById= async(id)=>{
    try{
        const book = await dblayer.getBookById(id);         
        return book;
    } catch(error){
        throw error;
    } };


getOrCreateCart = async ({ userId, sessionId }) => {
    try {
        const cart = await dblayer.getOrCreateCart({ userId, sessionId });  
        return cart;
    } catch (error) {
        throw error;
    }};
calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + item.quantity * item.priceAtAddTime, 0);
};
service.addToCart = async (userId, sessionId, bookId, quantity) => {
    try{
        const cart = await getOrCreateCart({ userId, sessionId });
        const book = await getBookById(bookId);
        if (!book) {
          throw new Error('Book not found' );
        }   
        const existingitem = cart.items.find(item => item.bookId.toString() === bookId);
        if (existingitem) {
          existingitem.quantity += quantity;
        } else {
           cart.items.push({ bookId, quantity, priceAtAddTime: book.price });
        }
        cart.totalAmount = calculateTotalAmount(cart.items);
        await cart.save();
        return cart;
        }
    catch(error){
        throw error;
    }};
service.getCart = async (userId, sessionId) => {
    try {
        const cart = await dblayer.getCart({ userId, sessionId });  
        return cart
    } catch (error) {
        throw error;
    }};
service.updateCart = async (userId, sessionId, bookId, quantity) => {
    try {
        const cart = await dblayer.getCart({ userId, sessionId });
        if (!cart) {
            throw new Error('Cart not found');
        }       
        const item= cart.items.find(item => item.bookId.toString() === bookId);
        if (!item) {
            throw new Error('Book not found in cart');
        }       
        item.quantity = quantity;
        cart.totalAmount = calculateTotalAmount(cart.items);
        await cart.save();
        return cart;
    }
    catch (error) {
        throw error;
    }};
service.removeCartItem = async (userId, sessionId, bookId) => {
    try {
        const cart = await dblayer.getCart({ userId, sessionId });  
        if (!cart) {
            throw new Error('Cart not found');
        }           
        cart.items = cart.items.filter(item => item.bookId.toString() !== bookId);
        cart.totalAmount = calculateTotalAmount(cart.items);
        await cart.save();
        return cart;
    } catch (error) {
        throw error;
    }};

module.exports = service ;
