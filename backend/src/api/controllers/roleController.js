import Role from "../models/roleModel.js";
import logger from "../../utils/logger.js";
// Add a new role
const addRole = async (req, res) => {
  const { roleName, roleDescription } = req.body;

  try {
    const existingRole = await Role.findOne({ roleName });

    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = new Role({
      roleName,
      roleDescription,
    });
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Could not add role" });
  }
};

module.exports = { addRole };
