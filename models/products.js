const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
                        productName:String,
                        productDescription:String,
                        productPrice:Number,
                        productQuantity:Number,
                        productImage:String
})

const products = mongoose.model("products",productSchema);

module.exports = products;