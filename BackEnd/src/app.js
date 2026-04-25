const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const dotenv=require('dotenv');
const connectDB=require('./config/db');
const userRoutes=require('./routing/user_routes');
const bookRoutes=require('./routing/books_routes');

const app=express();


app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
dotenv.config();
app.get('/',(req,res)=>{
    res.send("Welcome to Ink&Quill API");
});
app.use('/api/user',userRoutes);
app.use('/api/collection',bookRoutes);

const PORT = process.env.PORT || 3000;
connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
