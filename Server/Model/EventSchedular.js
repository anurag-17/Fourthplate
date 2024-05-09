const mongoose = require("mongoose");
const emailSchedularSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },

    joinTimestamp:{
        type: Date,
        required: true,
    }
})


const EmailScheduler = mongoose.model("EmailScheduler", emailSchedularSchema);

module.exports = EmailScheduler;