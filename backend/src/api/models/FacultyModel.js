import mongoose from "mongoose";
const Schema = mongoose.Schema;

const facultySchema = new Schema(
  {
    facultyName: {
      type: String,
      required: true,
    },
    facultyCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Faculty = mongoose.model("Faculty", facultySchema);
module.exports = Faculty;
