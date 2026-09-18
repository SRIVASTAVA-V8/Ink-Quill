const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const dotenv=require('dotenv');
const connectDB=require('./config/db');
const userRoutes=require('./routing/user_routes');
const bookRoutes=require('./routing/books_routes');
const cartRoutes=require('./routing/cart_routes');
const wishlistRoutes=require('./routing/wishlist_routes');
const orderRoutes=require('./routing/order_routes');
const adminRoutes=require('./routing/admin_routes');
const cookieParser=require('cookie-parser');

const app=express();


app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
dotenv.config();
app.get('/',(req,res)=>{
    res.send("Welcome to Ink&Quill API");
});
app.use('/api/user',userRoutes);
app.use('/api/collection',bookRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/wishlist',wishlistRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/admin', adminRoutes);
//console.log(`Connecting to database... ${process.env.MONGO_URI}`);
const PORT = process.env.PORT || 3000;
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
