import mongoose from "mongoose";
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    courseCredit: {
      type: Number,
      required: true,
    },
    faculty: {
      type: String,
      default: null,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
