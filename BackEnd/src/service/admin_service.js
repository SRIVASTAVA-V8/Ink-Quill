const dblayer = require('../model/controller');

const adminService = {};


adminService.getAllUsers = async () => {
    return await dblayer.getAllUsers();
};

adminService.getUserById = async (userId) => {
    const user = await dblayer.getUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

adminService.updateUserRole = async (userId, role) => {
    const allowedRoles = ['user', 'admin'];
    if (!allowedRoles.includes(role)) {
        throw new Error('Invalid role');
    }
    const user = await dblayer.updateUserRole(userId, role);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

adminService.updateUserStatus = async (userId, isActive) => {
    if (typeof isActive !== 'boolean') {
        throw new Error('isActive must be a boolean');
    }
    const user = await dblayer.updateUserStatus(userId, isActive);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

adminService.getAllOrders = async () => {
    return await dblayer.getAllOrders();
};

adminService.getDashboardSummary = async () => {
    return await dblayer.getDashboardStats();
};

// Inventory management
adminService.getInventory = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    return await dblayer.getAllBooks(page, limit, skip);
};

adminService.getInventoryDetails = async (bookId) => {
    const book = await dblayer.getBookInventory(bookId);
    if (!book) {
        throw new Error('Book not found');
    }
    return book;
};

adminService.updateInventory = async (bookId, quantity, operation) => {
    if (!['add', 'subtract', 'set'].includes(operation)) {
        throw new Error('Invalid operation. Use add, subtract, or set');
    }
    if (typeof quantity !== 'number' || quantity < 0) {
        throw new Error('Quantity must be a non-negative number');
    }
    
    const book = await dblayer.updateBookStock(bookId, quantity, operation);
    if (!book) {
        throw new Error('Book not found');
    }
    if (book.stock < 0) {
        throw new Error('Insufficient stock');
    }
    return book;
};

adminService.updateProductDetails = async (bookId, details) => {
    if (!details || Object.keys(details).length === 0) {
        throw new Error('No details provided for update');
    }
    
    const book = await dblayer.updateBookDetails(bookId, details);
    if (!book) {
        throw new Error('Book not found');
    }
    return book;
};

adminService.getLowStockAlerts = async (threshold = 10) => {
    if (typeof threshold !== 'number' || threshold < 0) {
        throw new Error('Threshold must be a non-negative number');
    }
    return await dblayer.getLowStockBooks(threshold);
};

// Shipping Management
adminService.getOrderDetails = async (orderId) => {
    const order = await dblayer.getOrderById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    return order;
};

adminService.updateShipping = async (orderId, shippingData) => {
    const { carrier, trackingNumber, estimatedDeliveryDate } = shippingData;
    
    if (!carrier || !trackingNumber) {
        throw new Error('Carrier and tracking number are required');
    }
    if (!estimatedDeliveryDate) {
        throw new Error('Estimated delivery date is required');
    }
    
    const deliveryDate = new Date(estimatedDeliveryDate);
    if (deliveryDate < new Date()) {
        throw new Error('Estimated delivery date must be in the future');
    }
    
    const order = await dblayer.updateShippingInfo(orderId, shippingData);
    if (!order) {
        throw new Error('Order not found');
    }
    return order;
};

adminService.markDelivered = async (orderId) => {
    const order = await dblayer.markOrderDelivered(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    return order;
};

adminService.trackShipping = async (orderId) => {
    const tracking = await dblayer.getOrderShippingTrack(orderId);
    if (!tracking) {
        throw new Error('Order not found');
    }
    return tracking;
};

// Book Management
adminService.createBook = async (bookData) => {
    const { title, author, price, category, stock } = bookData;
    
    // Validate required fields
    if (!title || !author || !price || !category || stock === undefined) {
        throw new Error('Title, author, price, category, and stock are required');
    }
    
    // Validate category
    const allowedCategories = ["Fiction", "Non-Fiction", "Sci-Fi", "Biography", "Romance", "Mystery", "Fantasy"];
    if (!allowedCategories.includes(category)) {
        throw new Error(`Invalid category. Allowed values: ${allowedCategories.join(', ')}`);
    }
    
    // Validate numeric fields
    if (typeof price !== 'number' || price < 0) {
        throw new Error('Price must be a non-negative number');
    }
    if (typeof stock !== 'number' || stock < 0) {
        throw new Error('Stock must be a non-negative number');
    }
    
    if (bookData.discount && (typeof bookData.discount !== 'number' || bookData.discount < 0)) {
        throw new Error('Discount must be a non-negative number');
    }
    
    if (bookData.ISBN) {
        const existingBook = await dblayer.findBookByISBN(bookData.ISBN);
        if (existingBook) {
            throw new Error('ISBN already exists');
        }
    }
    
    const newBook = await dblayer.createBook(bookData);
    return newBook;
};

adminService.updateBook = async (bookId, bookData) => {
    const allowedFields = ['title', 'author', 'description', 'ISBN', 'price', 'discount', 'category', 'tags', 'stock', 'language', 'publisher', 'publishedDate', 'image', 'ratingAvg', 'ratingCount'];
    const allowedCategories = ["Fiction", "Non-Fiction", "Sci-Fi", "Biography", "Romance", "Mystery", "Fantasy"];
    
    const updateData = {};
    Object.keys(bookData).forEach(key => {
        if (allowedFields.includes(key)) {
            updateData[key] = bookData[key];
        }
    });
    
    if (Object.keys(updateData).length === 0) {
        throw new Error('No valid fields provided for update');
    }
    
    if (updateData.category && !allowedCategories.includes(updateData.category)) {
        throw new Error(`Invalid category. Allowed values: ${allowedCategories.join(', ')}`);
    }
    
    if (updateData.price !== undefined && (typeof updateData.price !== 'number' || updateData.price < 0)) {
        throw new Error('Price must be a non-negative number');
    }
    
    if (updateData.stock !== undefined && (typeof updateData.stock !== 'number' || updateData.stock < 0)) {
        throw new Error('Stock must be a non-negative number');
    }
    
    const book = await dblayer.updateFullBook(bookId, updateData);
    if (!book) {
        throw new Error('Book not found');
    }
    return book;
};

adminService.deleteBook = async (bookId) => {
    const book = await dblayer.deleteBook(bookId);
    if (!book) {
        throw new Error('Book not found');
    }
    return book;
};

adminService.searchAndFilterBooks = async (filters = {}, sortBy = 'createdAt', sortOrder = -1, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const searchFilters = {};
    
    if (filters.title) {
        searchFilters.title = { $regex: filters.title, $options: 'i' };
    }
    if (filters.author) {
        searchFilters.author = { $regex: filters.author, $options: 'i' };
    }
    if (filters.category) {
        searchFilters.category = filters.category;
    }
    if (filters.language) {
        searchFilters.language = filters.language;
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        searchFilters.price = {};
        if (filters.minPrice !== undefined) searchFilters.price.$gte = filters.minPrice;
        if (filters.maxPrice !== undefined) searchFilters.price.$lte = filters.maxPrice;
    }
    if (filters.isbn) {
        searchFilters.ISBN = filters.isbn;
    }
    if (filters.inStock !== undefined) {
        if (filters.inStock) {
            searchFilters.stock = { $gt: 0 };
        } else {
            searchFilters.stock = { $lte: 0 };
        }
    }
    
    const allowedSortFields = ['title', 'author', 'price', 'stock', 'createdAt', 'ratingAvg'];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const finalSortOrder = sortOrder === 1 ? 1 : -1;
    const sort = { [finalSortBy]: finalSortOrder };
    
    const [books, total] = await Promise.all([
        dblayer.searchBooks(searchFilters, sort, page, limit, skip),
        dblayer.searchBooksCount(searchFilters)
    ]);
    
    return {
        books,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

module.exports = adminService;
