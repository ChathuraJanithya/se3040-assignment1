import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    roomID: {
      type: String,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    resourceID: {
      type: String,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
    },
    reservedDate: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["booked", "available"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
