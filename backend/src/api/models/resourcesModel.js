import mongoose from "mongoose";
const Schema = mongoose.Schema;

const resourceSchema = new Schema(
  {
    resourceName: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model("Resource", resourceSchema);
module.exports = Resource;
