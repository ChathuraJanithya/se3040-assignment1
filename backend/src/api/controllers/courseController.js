import Course from "../models/courseModel.js";
import logger from "../../utils/logger";

// Add a new course

const addCourse = async (req, res) => {
  const { courseName, courseCode, courseCredit, faculty } = req.body;

  try {
    const userRole = req.role;
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const existingCourse = await Course.findOne({
      courseCode,
    });
    if (existingCourse) {
      return res.status(400).json({ message: "Course already exists" });
    }

    const course = new Course({
      courseName,
      courseCode,
      courseCredit,
      faculty,
    });

    await course.save();

    res.status(201).json(course);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Could not add course." });
  }
};

// Remove a course
const removeCourse = async (req, res) => {
  try {
    const userRole = req.role;
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const courseID = req.params.id;
    const course = await Course.findById(courseID);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    await Course.findByIdAndDelete(courseID);

    res.status(200).json({ message: "Course removed successfully." });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Could not remove course." });
  }
};

// Get all courses
const getCourses = async (req, res) => {
  try {
    const userRole = req.role;
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const courses = await Course.find();

    res.status(200).json({ courses });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Could not fetch courses." });
  }
};

// Get a course by course code
// Get a course by course id
const getCourseById = async (req, res) => {
  try {
    const userRole = req.role;
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Could not fetch course." });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  try {
    const userRole = req.role;
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const courseId = req.params.id;
    const { courseName, courseCode, courseCredit, faculty } = req.body;

    const updatedCourse = {
      courseName,
      courseCode,
      courseCredit,
      faculty,
    };

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    await Course.findByIdAndUpdate(courseId, updatedCourse);

    res.status(200).json(updatedCourse);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Could not update course." });
  }
};

module.exports = {
  addCourse,
  removeCourse,
  getCourses,
  getCourseById,
  updateCourse,
};
