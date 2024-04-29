import Session from "../models/classSessionsModel.js";
import logger from "../../utils/logger.js";
import moment from "moment";

// Add a new session
const addSession = async (req, res) => {
  const { sessionName, course, faculty, startTime, endTime, location } =
    req.body;

  const startDateTime = moment(startTime).format("LT");
  const endDateTime = moment(endTime).format("LT");

  try {
    const session = new Session({
      sessionName,
      course,
      faculty,
      startTime: startDateTime,
      endTime: endDateTime,
      location,
    });

    await session.save();

    res.status(201).json(session);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Could not add session." });
  }
};

module.exports = { addSession };
