const mongoose = require("mongoose");
const SubAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, "Please provide user name."],
  },
  email: {
    type: String,
    required:[true, "Please provide user email."],
    unique :  true,
  },
  contact: {
    type: String,
    // unique: [true, "Contact number already exist."],
  },
  password: {
    type: String,
    required: [true, "Provide passcode"],
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
    default: "SubAdmin",
  },
  activeToken: {
    type: String,
  },
  resetToken: {
    type: String,
  },


});
const SubAdmin = mongoose.model("SubAdmin", SubAdminSchema);
module.exports = SubAdmin;
