import Room from "../models/roomModel.js";
import logger from "../../utils/logger.js";
// Add a new room
const addRoom = async (req, res) => {
  const { roomName, capacity, location } = req.body;

  try {
    const existingRoom = await Room.findOne({
      roomName,
    });
    if (existingRoom) {
      return res.status(400).json({ message: "Room already exists" });
    }

    const room = new Room({
      roomName,
      capacity,
      location,
    });

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Could not add room." });
  }
};

module.exports = {
  addRoom,
};
