import StudentEnroll from "../models/studentEnrollModel";
import logger from "../../utils/logger";
import Course from "../models/courseModel";
import Session from "../models/classSessionsModel";
import Timetable from "../models/timetableModel";
import mongoose from "mongoose";

const enrollStudent = async (req, res) => {
  try {
    const { studentID, enrolledCourse } = req.body;

    // Find the student's enrollment document
    let studentEnrollment = await StudentEnroll.findOne({ studentID });

    // If the student is not enrolled in any courses, create a new enrollment document
    if (!studentEnrollment) {
      studentEnrollment = new StudentEnroll({
        studentID,
        enrolledCourses: [enrolledCourse],
      });
      await studentEnrollment.save();
      return res.status(201).json({ message: "Student enrolled successfully" });
    }

    // Check if the student is already enrolled in the course
    const isEnrolled = (studentEnrollment, enrolledCourse) => {
      if (Array.isArray(enrolledCourse)) {
        // enrolledCourse is an array
        return studentEnrollment.enrolledCourses.some((course) =>
          enrolledCourse.includes(course._id.toString())
        );
      }
    };

    // If the student is already enrolled in the course, return an error
    if (isEnrolled(studentEnrollment, enrolledCourse)) {
      return res
        .status(400)
        .json({ message: "Student is already enrolled in this course" });
    }

    // Add the course to the student's enrolled courses
    studentEnrollment.enrolledCourses.push(enrolledCourse);

    // Save the updated student enrollment
    await studentEnrollment.save();

    res.status(200).json({ message: "Student enrolled successfully" });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Enrollment failed", error: error.message });
  }
};

const getEnrollemtsByStudent = async (req, res) => {
  try {
    const userID = req.user;

    const enrollments = await StudentEnroll.find({ studentID: userID });

    //get course details
    const courses = await Course.find({
      _id: { $in: enrollments[0].enrolledCourses },
    });

    res.status(200).json(courses);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Failed to get enrollments", error: error.message });
  }
};

const getEnrolledCourseTimetable = async (req, res) => {
  try {
    const userID = req.user;

    const enrollments = await StudentEnroll.find({
      studentID: userID,
    }).populate("enrolledCourses");

    const courseIDs = enrollments.map((enrollment) =>
      enrollment.enrolledCourses.map((course) => course._id)
    );

    const sessions = await Session.find({
      course: { $in: courseIDs },
    });

    if (sessions.length === 0) {
      return res.status(404).json({ message: "No sessions found" });
    }

    const sessionIDs = sessions.map((session) => session._id);

    const timetable = await Timetable.find({
      classSessions: { $in: sessionIDs },
    }).populate("classSessions");

    if (timetable.length === 0) {
      return res.status(404).json({ message: "No timetable found" });
    }

    res.status(200).json(timetable);
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Failed to get enrollments", error: error.message });
  }
};

module.exports = {
  enrollStudent,
  getEnrollemtsByStudent,
  getEnrolledCourseTimetable,
};
