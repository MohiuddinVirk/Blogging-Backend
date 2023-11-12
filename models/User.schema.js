const mongoose = require("mongoose")
const followingobj = new mongoose.Schema({
    Username:String,
    UserId:String,
  });
const userSchema = mongoose.Schema({
    FullName :String,
    email:String,
    role:String,
    Password:String,
    dob:Date,
    age:Number,
    blocked:Boolean,
    reason:String,
    Hobbies:[String],
    Following:[followingobj],
    Interests:[String],
},{timestamps:true})
const model = mongoose.model("User" , userSchema);
module.exports = model;

