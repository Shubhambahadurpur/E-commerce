const mongoose = require('mongoose');

module.exports.init = async function(){
    await mongoose.connect("mongodb+srv://e-commerce:gYqxn7k7WyGZ2xrs@cluster0.tz4bxdn.mongodb.net/e-commerce");
}