const mongoose = require("mongoose")

const foodSchema = new mongoose.Schema({
    "name":{
        type:String,
        required:[true, "Please provide user email."],
        unique :  true,
    },
 
})
const Food = mongoose.model("Food", foodSchema)
module.exports = Food;