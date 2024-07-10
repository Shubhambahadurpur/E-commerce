const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
                    username:String,
                    password:String,
                    is_verify:Boolean,
                    role:Number
})

const user = mongoose.model("user",userSchema);


module.exports = user;