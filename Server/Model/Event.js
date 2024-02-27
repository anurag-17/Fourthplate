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
      type: String,
    },
    coodinates: {
      type: Array,
    },
    food:{
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    joinerId: [{ type: mongoose.Schema.Types.ObjectId, ref: User }],
  },
  {
    timestamps: true,
  }
);
const Event = mongoose.model("Event", eventSchema)
module.exports = Event