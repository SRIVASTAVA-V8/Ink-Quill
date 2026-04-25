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
service.getOrCreateCart = async ({ userId, sessionId }) => {
    const cart = await Cart.findOne({ $or: [{ userId }, { sessionId }] });
    if (cart) {
        return cart;
    }   
    const newCart = new Cart({ userId, sessionId, items: [], totalAmount: 0 });
    return await newCart.save();
};
dblayer.getCart = async (userId, sessionId) => {
    const cart = await Cart.findOne({ $or: [{ userId }, { sessionId }] }).populate('items.bookId', 'title priceAtAddTime image totalAmount');

};
module.exports = dblayer;