const mongoose = require("mongoose");
const User = require("./User");
const Food = require("./Food");
const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
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
    state: {
      type: String,
    },
    city: {
      type: String
    },
    // coordinates: {
    //   type: { type: String, enum: ['Point'], default: 'Point' },
    //   coordinates: { type: [Number], required: true } // [longitude, latitude]
    // },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    food:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Food,
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
eventSchema.index({ coordinates: '2dsphere' });
const Event = mongoose.model("Event", eventSchema)
module.exports = Event