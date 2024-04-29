import Faculty from "../models/FacultyModel.js";
import logger from "../../utils/logger.js";
// Add a new faculty
const addFaculty = async (req, res) => {
  const { facultyName, facultyCode } = req.body;

  try {
    const existingFaculty = await Faculty.findOne({
      facultyCode,
    });
    if (existingFaculty) {
      return res.status(400).json({ message: "Faculty already exists" });
    }

    const faculty = new Faculty({
      facultyName,
      facultyCode,
    });

    await faculty.save();

    res.status(201).json(faculty);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Could not add faculty." });
  }
};

module.exports = {
  addFaculty,
};
