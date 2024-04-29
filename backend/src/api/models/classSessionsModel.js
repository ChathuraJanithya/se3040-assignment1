import mongoose from "mongoose";
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
  {
    sessionName: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    faculty: {
      type: String,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
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
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
