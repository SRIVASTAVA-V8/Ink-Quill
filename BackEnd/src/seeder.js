const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.join(__dirname, '../.env')
});


const connectDB = require('./config/db');
const User = require('./model/users');
const Book = require('./model/books');
const Cart = require('./model/cart');
const Order = require('./model/order');
const seedData = require('./seedData');


// Convert MongoDB exported values into normal Mongoose values
const cleanBookData = (books) => {
  return books.map((book) => {
    const cleanedBook = { ...book };

    // Convert MongoDB Extended JSON date
    if (
      cleanedBook.publishedDate &&
      typeof cleanedBook.publishedDate === 'object' &&
      cleanedBook.publishedDate.$date
    ) {
      cleanedBook.publishedDate = new Date(
        cleanedBook.publishedDate.$date
      );
    }

    // Remove MongoDB-specific fields
    delete cleanedBook._id;
    delete cleanedBook.__v;
    delete cleanedBook.createdAt;
    delete cleanedBook.updatedAt;

    // Convert $numberLong ISBN to normal string
    if (
      cleanedBook.ISBN &&
      typeof cleanedBook.ISBN === 'object' &&
      cleanedBook.ISBN.$numberLong
    ) {
      cleanedBook.ISBN = String(cleanedBook.ISBN.$numberLong);
    }

    // Make sure tags are always an array
    if (typeof cleanedBook.tags === 'string') {
      cleanedBook.tags = cleanedBook.tags
        .split(';')
        .map(tag => tag.trim())
        .filter(Boolean);
    }

    // Make sure image is always an array
    if (typeof cleanedBook.image === 'string') {
      cleanedBook.image = [cleanedBook.image];
    }

    return cleanedBook;
  });
};


const seedDataFunction = async () => {
  await connectDB();

  try {
    // Clear existing seed data
    await Order.deleteMany();
    await Cart.deleteMany();
    await User.deleteMany();
    await Book.deleteMany();

    // Clean books before inserting
    const cleanedBooks = cleanBookData(seedData.books);

    // Insert books
    const books = await Book.insertMany(cleanedBooks);

    const [book1, book2, book3] = books;

    // Create users through Mongoose so password hashing hook runs
    const users = [];

    for (const userData of seedData.users) {
      const user = new User(userData);
      await user.save();
      users.push(user);
    }

    const [user1, user2] = users;

    // Update cart with user and book IDs
    seedData.carts[0].userId = user1._id;
    seedData.carts[0].items[0].bookId = book1._id;
    seedData.carts[0].items[1].bookId = book2._id;

    const cart = new Cart(seedData.carts[0]);
    await cart.save();

    // Update order with user and book IDs
    seedData.orders[0].userId = user1._id;
    seedData.orders[0].orderItems[0].bookId = book1._id;
    seedData.orders[0].orderItems[1].bookId = book3._id;

    const order = new Order(seedData.orders[0]);
    await order.save();

    console.log('Seeder completed successfully');

    process.exit(0);

  } catch (error) {
    console.error('Seeder error:', error);
    process.exit(1);
  }
};

seedDataFunction();