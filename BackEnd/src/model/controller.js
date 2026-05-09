const User = require('./users');
const Book = require('./books');
const Cart = require('./cart');
let dblayer = {};

// Function to find a user by email
dblayer.findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

// Function to create a new user
 dblayer.createUser = async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
};

dblayer.getBooks = async (filter, sort) => {
    return await Book.find(filter).select(' _id title author price category language image ratingAvg ratingCount').sort(sort || { createdAt: -1 });
}

dblayer.getBookById = async (id) => {
    return await Book.findById(id);
}  
dblayer.getOrCreateCart = async (userId, sessionId) => {
    const cart = await Cart.findOne({ $or: [{userId: userId }, { sessionId: sessionId }] });
    if (cart) {
        return cart;
    }   
    const newCart = new Cart({ userId, sessionId, items: [], totalAmount: 0 });
    return await newCart.save();
};
dblayer.getCart = async (query) => {
    const cart=  await Cart.findOne(query).populate('items.bookId', 'title priceAtAddTime image totalAmount');
    console.log(`cart based on :${query} is : ${cart}`);
    return cart;
    

};
module.exports = dblayer;