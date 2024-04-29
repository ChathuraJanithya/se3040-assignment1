import mongoose from "mongoose";
const Schema = mongoose.Schema;

const studentEnrollSchema = new Schema(
  {
    studentID: {
      type: String,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    enrolledCourses: [
      {
        type: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const StudentEnroll = mongoose.model("StudentEnroll", studentEnrollSchema);

module.exports = StudentEnroll;
