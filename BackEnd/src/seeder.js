const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const User = require('./model/users');
const Book = require('./model/books');
const Cart = require('./model/cart');
const Order = require('./model/order');
const seedData = require('./seedData');

const seedDataFunction = async () => {
  await connectDB();

  try {
    await Order.deleteMany();
    await Cart.deleteMany();
    await User.deleteMany();
    await Book.deleteMany();

    const books = await Book.insertMany(seedData.books);
    const [book1, book2, book3] = books;


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