const User = require('./users');
const Book = require('./books');
const Cart = require('./cart');
const Wishlist = require('./wishlist');
let dblayer = {};

// Function to find a user by email
dblayer.findUserByEmail = async (email) => {
    return await User.findOne({ email });
};
dblayer.getProfile = async (userId) => {
    return await User.findById(userId).select(' _id name email role address');
};

// Function to create a new user
 dblayer.createUser = async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
};

dblayer.getBooks = async (filter, sort, page, limit, skip) => {
    return await Book.find(filter)
    .sort(sort || { createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select(' _id title author price category language image ratingAvg ratingCount');
}

dblayer.getBookById = async (id) => {
    return await Book.findById(id);
}  
dblayer.getOrCreateCart = async (userId, sessionId) => {
    const cart = await Cart.findOne({ $or: [{userId: userId }, { sessionId: sessionId }] }).populate('items.bookId', 'title priceAtAddTime image quantity totalAmount');
    if (cart) {
        return cart;
    }   
    const newCart = new Cart({ userId, sessionId, items: [], totalAmount: 0 });
    return await newCart.save();
};
dblayer.getCart = async (query,options={}) => {
    const{session}=options;
    const cart=  await Cart.findOne(query).populate('items.bookId', 'title priceAtAddTime image quantity totalAmount').session(session);
   // console.log(`cart based on :${query} is : ${cart}`);
    return cart;
};

dblayer.clearCart = async (cartId, options={}) => {
  const { session } = options;
  return await Cart.findByIdAndUpdate(
    cartId,
    { $set: { items: [] } },
    { session }
  );
};


// Wishlist functions
dblayer.getOrCreateWishlist = async (userId, sessionId) => {
    const wishlist = await Wishlist.findOne({ $or: [{userId: userId }, { sessionId: sessionId }] }).populate('items.bookId', 'title author price image');
    if (wishlist) {
        return wishlist;
    }   
    const newWishlist = new Wishlist({ userId, sessionId, items: [] });
    return await newWishlist.save();
};

dblayer.getWishlist = async (query, page, limit) => {
    const skip = (page - 1) * limit;
    const wishlist = await Wishlist.findOne(query).skip(skip).limit(limit).populate('items.bookId', '_id title author price image');
    return wishlist;
};

dblayer.updateWishlist = async (wishlist) => {
    return await wishlist.save();
};

dblayer.createOrder = async(orderData, session)=>{
    const order = new Order(orderData); 
    return await order.save({ session });
}
dblayer.countOrdersByUser = async (userId) => {
    return await Order.countDocuments({ userId });
}
dblayer.getOrderHistory = async (userId, page, limit, skip) => {
    return await Order.find({ userId })
        .sort({ placedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id items totalAmount orderStatus shippingAddress paymentInfo deliveredAt placedAt');
};
dblayer.getOrderDetails = async (userId, orderId) => {
    return await    Order.findOne({ _id: orderId, userId }).populate('items.bookId', 'title author price image ');
};
dblayer.confirmRazorpayPayment = async (orderId, razorpayOrderId, razorpayPaymentId) => {
  return await Order.findByIdAndUpdate(
    orderId,
    {
      $set: {
        paymentStatus:     'paid',
        orderStatus:       'confirmed',
        confirmedAt:       new Date(),
        razorpayOrderId,
        razorpayPaymentId,
      },
    },
    { new: true }
  );
};
dblayer.markPaymentFailed = async (orderId) => {
  return await Order.findByIdAndUpdate(
    orderId,
    { $set: { paymentStatus: 'failed', orderStatus: 'placed' } },
    { new: true }
  );
};

// Admin operations
dblayer.getAllUsers = async () => {
    return await User.find().select('_id name email role isActive createdAt updatedAt');
};

dblayer.getUserById = async (userId) => {
    return await User.findById(userId).select('_id name email role address isActive createdAt updatedAt');
};

dblayer.updateUserRole = async (userId, role) => {
    return await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
    ).select('_id name email role isActive createdAt updatedAt');
};

dblayer.updateUserStatus = async (userId, isActive) => {
    return await User.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true }
    ).select('_id name email role isActive createdAt updatedAt');
};

dblayer.getAllOrders = async () => {
    return await Order.find()
        .sort({ placedAt: -1 })
        .populate('userId', 'name email')
        .populate('items.bookId', 'title author price image');
};

dblayer.getDashboardStats = async () => {
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const orderCount = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    
    return {
        userCount,
        adminCount,
        orderCount,
        totalRevenue: revenueResult[0]?.totalRevenue || 0
    };
};

// Inventory operations
dblayer.getAllBooks = async (page, limit, skip) => {
    return await Book.find()
        .select('_id title author price stock category language publishedDate')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

dblayer.getBookInventory = async (bookId) => {
    return await Book.findById(bookId).select('_id title author price stock category image isbn');
};

dblayer.updateBookStock = async (bookId, quantity, operation) => {
    let updateQuery;
    if (operation === 'add') {
        updateQuery = { $inc: { stock: quantity } };
    } else if (operation === 'subtract') {
        updateQuery = { $inc: { stock: -quantity } };
    } else if (operation === 'set') {
        updateQuery = { $set: { stock: quantity } };
    }
    
    return await Book.findByIdAndUpdate(
        bookId,
        updateQuery,
        { new: true }
    ).select('_id title stock');
};

dblayer.updateBookDetails = async (bookId, details) => {
    const allowedFields = ['price', 'discount', 'publisher', 'description', 'tags'];
    const updateData = {};
    
    Object.keys(details).forEach(key => {
        if (allowedFields.includes(key)) {
            updateData[key] = details[key];
        }
    });
    updateData.updatedAt = new Date();
    
    return await Book.findByIdAndUpdate(
        bookId,
        { $set: updateData },
        { new: true }
    ).select('_id title author price stock');
};

dblayer.getLowStockBooks = async (threshold = 10) => {
    return await Book.find({ stock: { $lt: threshold } })
        .select('_id title author stock category')
        .sort({ stock: 1 });
};

// Shipping Management
dblayer.getOrderById = async (orderId) => {
    return await Order.findById(orderId)
        .populate('userId', 'name email')
        .populate('items.bookId', 'title author price image');
};

dblayer.updateOrderStatus = async (orderId, orderStatus) => {
    return await Order.findByIdAndUpdate(
        orderId,
        { $set: { orderStatus } },
        { new: true }
    ).select('_id orderStatus shippingInfo deliveredAt');
};

dblayer.updateShippingInfo = async (orderId, shippingData) => {
    const updateData = {
        orderStatus: 'shipped',
        shippingInfo: {
            carrier: shippingData.carrier,
            trackingNumber: shippingData.trackingNumber,
            estimatedDeliveryDate: shippingData.estimatedDeliveryDate,
            shippedAt: new Date()
        }
    };
    
    return await Order.findByIdAndUpdate(
        orderId,
        { $set: updateData },
        { new: true }
    ).select('_id orderStatus shippingInfo');
};

dblayer.markOrderDelivered = async (orderId) => {
    return await Order.findByIdAndUpdate(
        orderId,
        { 
            $set: { 
                orderStatus: 'delivered',
                deliveredAt: new Date()
            }
        },
        { new: true }
    ).select('_id orderStatus shippingInfo deliveredAt');
};

dblayer.getOrderShippingTrack = async (orderId) => {
    return await Order.findById(orderId).select('_id orderStatus shippingInfo deliveredAt');
};

// Book Management
dblayer.createBook = async (bookData) => {
    const newBook = new Book(bookData);
    return await newBook.save();
};

dblayer.findBookByISBN = async (isbn) => {
    return await Book.findOne({ ISBN: isbn });
};

dblayer.deleteBook = async (bookId) => {
    return await Book.findByIdAndDelete(bookId);
};

dblayer.updateFullBook = async (bookId, bookData) => {
    return await Book.findByIdAndUpdate(
        bookId,
        { $set: { ...bookData, updatedAt: new Date() } },
        { new: true }
    );
};

dblayer.searchBooks = async (filters, sort, page, limit, skip) => {
    return await Book.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('_id title author price stock category language publishedDate');
};

dblayer.searchBooksCount = async (filters) => {
    return await Book.countDocuments(filters);
};

module.exports = dblayer;