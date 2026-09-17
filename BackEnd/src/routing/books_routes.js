const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const routing = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const service = require('../service/book_service');

routing.get('/item/:id',async(req,res)=>{
  try{
    const book = await service.getBookById(req.params.id);
    if(book){
      res.status(200).json(book);
    }
    else{
      res.status(404).json({ message: 'Book not found' });
    }
  }catch(error){
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});
routing.get ('/:collection',async (req, res) => {
     console.log(req.params.collection);
     console.log(req.query);
     const {category,search,language,author,min_price,max_price,sortby,exclude} = req.query;
     let collection=req.params.collection;    
     const page = parseInt(req.query.page) || 1;
     limit = parseInt(req.query.limit) || 10;   
     try{
       const books = await service.getBooks({ collection, category, search, language, author, min_price, max_price, sortby, exclude, page, limit });
        res.status(200).json(books);
     }
     catch (error) {
           console.log(error);
           res.status(400).json({ message: error.message });
      } });

 

module.exports = routing;
