import Booking from "../models/bookingModel.js";
import moment from "moment";
import logger from "../../utils/logger";
// Controller function to book a
const addBooking = async (req, res) => {
  try {
    const { roomID, resourceID, startTime, endTime, reservedDate, status } =
      req.body;

    const startDateTime = moment(startTime).format("LT");
    const endDateTime = moment(endTime).format("LT");

    console.log(startDateTime, endDateTime);

    let overlappingBooking = await Booking.findOne({
      roomID,
      resourceID,
      reservedDate,
      $or: [
        {
          startTime: { $lte: startDateTime },
          endTime: { $gte: startDateTime },
        },
        {
          startTime: { $lte: endDateTime },
          endTime: { $gte: endDateTime },
        },
      ],
    });

    console.log(overlappingBooking);

    if (overlappingBooking) {
      return res
        .status(401)
        .json({ message: "Booking overlaps with existing booking" });
    }

    const newBooking = new Booking({
      roomID,
      resourceID,
      startTime: startDateTime,
      endTime: endDateTime,
      reservedDate,
      status,
    });

    await newBooking.save();

    res.status(201).json(newBooking);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
};

module.exports = {
  addBooking,
};
