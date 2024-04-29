import mongoose from "mongoose";
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    roomName: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
