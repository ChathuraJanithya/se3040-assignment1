import jwt from "jsonwebtoken";
const User = require("../models/userModel");

const AuthGuard = (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (req.path === "/user/login" || req.path === "/user/signup") {
    return next();
  }

  //! Checking token
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user.id;
    req.role = user.role.roleName;

    next();
  });
};

module.exports = { AuthGuard };
