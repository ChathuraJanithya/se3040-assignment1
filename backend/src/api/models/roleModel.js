import mongoose from "mongoose";
const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    roleName: {
      type: String,
      required: true,
    },
    roleDescription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
