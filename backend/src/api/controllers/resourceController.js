import Resource from "../models/resourcesModel";
import logger from "../../utils/logger";

// Add a new resource
const addResource = async (req, res) => {
  const { resourceName, resourceType, quantity } = req.body;

  try {
    const existingResource = await Resource.findOne({
      resourceName,
    });

    if (existingResource) {
      return res.status(400).json({ message: "Resource already exists" });
    }

    const resource = new Resource({
      resourceName,
      resourceType,
      quantity,
    });

    await resource.save();

    res.status(201).json(resource);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Could not add resource." });
  }
};

module.exports = { addResource };
