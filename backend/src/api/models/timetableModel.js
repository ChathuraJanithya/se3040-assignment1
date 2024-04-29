import mongoose from "mongoose";
const Schema = mongoose.Schema;

const timetableSchema = new Schema(
  {
    day: {
      type: String,
      required: true,
    },
    classSessions: [
      {
        type: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Timetable = mongoose.model("Timetable", timetableSchema);

module.exports = Timetable;
