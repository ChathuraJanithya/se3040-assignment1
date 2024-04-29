import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../../utils/logger.js";

//creating user
const signup = async (req, res) => {
  const { firstName, lastName, contact, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      firstName,
      lastName,
      contact,
      email,
      role,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    res.status(201).json({ token });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

//login function
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email }).populate(
      "role",
      "roleName"
    );

    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userData = {
      id: existingUser._id,
      email: existingUser.email,
      role: existingUser.role.roleName,
      name: existingUser.firstName + " " + existingUser.lastName,
    };

    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.status(201).json({ user: userData, token });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { signup, login };
