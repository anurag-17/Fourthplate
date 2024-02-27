const mongoose = require("mongoose");
const User = require("./User");
const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
    },
    description: {
      type: String,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    location: {
      type: String,
    },
    allowMember: {
      type: Number,
    },
    images: {
      type: Array,
    },
    coodinates: {
      type: Array,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    JoinerID: [{ type: mongoose.Schema.Types.ObjectId, ref: User }],
  },
  {
    timestamps: true,
  }
);
const Event = mongoose.model("Event", eventSchema)
module.exports = Event