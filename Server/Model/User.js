const mongoose = require("mongoose");
const Event = require("./Event");
const { type } = require("os");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, "Please provide user name."],
  },
  email: {
    type: String,
  },
  contact: {
    type: String,
    // unique: [true, "Contact number already exist."],
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  picture: {
    type: String,
  },
  gender: {
    type: String,
  },
  role: {
    type: String,
    default: "User",
  },
  eventJoined:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  isBlocked: {
    type: Boolean,
    default: false
  },
  activeToken: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  providerId:{
    type:String
  },
  appleId:{
    type:String,
    default:null
  }
});
const User = mongoose.model("User", userSchema);
module.exports = User;
