const { default: mongoose } = require('mongoose');
const dblayer = require('../model/controller');
const jwt = require('jsonwebtoken');

let service = {};

service.getBooks= async({ collection, category, search, language, author, min_price, max_price, sortby ,exclude, page, limit })=>{

    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const skip = (page - 1) * limit;
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
        filter.author = {
            $regex: `^${author}$`, $options: 'i'
        };
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
        const books = await dblayer.getBooks(filter,sort, page, limit,skip);
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

module.exports = service;