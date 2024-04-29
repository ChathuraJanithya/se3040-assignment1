import Timetable from "../models/timetableModel.js";
import Session from "../models/classSessionsModel.js";
import logger from "../../utils/logger.js";
import StudentEnroll from "../models/studentEnrollModel.js";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";

// Add a new timetable
const addTimetable = async (req, res) => {
  const { day, classSession } = req.body;

  try {
    //find if the day already has a timetable
    let existingTimetable = await Timetable.findOne({ day });

    if (!existingTimetable) {
      existingTimetable = new Timetable({
        day,
        classSessions: [classSession],
      });

      await existingTimetable.save();
      return res.status(201).json({ message: "New Timetable created" });
    }
    //check if the session already exists
    const sessionExists = (existingTimetable, classSession) => {
      if (Array.isArray(classSession)) {
        // classSession is an array
        return existingTimetable.classSessions.some((session) =>
          classSession.includes(session._id.toString())
        );
      }
    };
    if (sessionExists) {
      return res.status(400).json({ message: "Session already exists" });
    }

    existingTimetable.classSessions.push(classSession);
    await existingTimetable.save();

    res.status(200).json({ message: "Timetable updated successfully" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Could not add timetable." });
  }
};

const getTimetablebyCourseIdAndDate = async (req, res) => {
  try {
    const courseID = req.query.courseID;
    const day = req.query.day;

    const timetable = await Timetable.findOne({ day })
      .populate({
        path: "classSessions",
        populate: {
          path: "course",
          model: "Course",
          equal: { id: courseID },
        },
      })
      .exec();

    if (timetable.classSessions.length === 0) {
      return res
        .status(404)
        .json({ message: "No classes for this course on this day" });
    }

    res.status(200).json(timetable);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Could not get timetable" });
  }
};

const getTimetableForCourse = async (req, res) => {
  try {
    const courseID = req.params.id;

    const sessions = await Session.find({
      course: courseID,
    }).populate("course");

    if (sessions.length === 0) {
      return res.status(404).json({ message: "No sessions found" });
    }

    const sessionIDs = sessions.map((session) => session._id);

    const Timetables = await Timetable.find({
      classSessions: { $in: sessionIDs },
    }).populate({
      path: "classSessions",
      match: { course: courseID },
      populate: {
        path: "course faculty",
      }, // Populate session details
    });

    res.status(200).json(Timetables);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Could not get timetable" });
  }
};

// Update course timetable
const updateCourseTimetable = async (req, res) => {
  try {
    const courseId = req.params.id;
    const sessionData = req.body;

    // Find sessions that match the provided courseId
    const sessions = await Session.find({ course: courseId });

    // If there are no sessions found, return an error
    if (!sessions || sessions.length === 0) {
      return res
        .status(404)
        .json({ message: "No sessions found for the provided course ID." });
    }

    // Extract session IDs
    const sessionIds = sessions.map((session) => session._id);

    // Update the timetable associated with the found sessions
    const updatedTimetable = await Timetable.updateMany(
      { classsessions: { $in: sessionIds } },
      sessionData
    );

    await notifyStudents(courseId);

    res.status(200).json({
      message: "timetable updated successfully!",
      data: updatedTimetable,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete course timetable
const deletecourseTimetable = async (req, res) => {
  try {
    const courseId = req.params.courseid;

    // Find sessions that match the provided courseId
    const sessions = await Session.find({ course: courseId });

    // If there are no sessions found, return an error
    if (!sessions || sessions.length === 0) {
      return res
        .status(404)
        .json({ message: "No sessions found for the provided course ID." });
    }

    // Extract session IDs
    const sessionIds = sessions.map((session) => session._id);

    // Find timetables that have the provided course ID
    const timetablesToDelete = await Timetable.find({
      classsessions: { $in: sessionIds },
    });

    // If there are no timetables found, return an error
    if (!timetablesToDelete || timetablesToDelete.length === 0) {
      return res
        .status(404)
        .json({ message: "No timetable found for the provided course ID." });
    }

    const timetableIdsToDelete = timetablesToDelete.map(
      (timetable) => timetable._id
    );

    // Delete all timetables associated with the provided course ID
    const deletionResult = await Timetable.deleteMany({
      _id: { $in: timetableIdsToDelete },
    });

    res.status(200).json({
      message: "Timetable(s) deleted successfully!",
      deletionResult: deletionResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//notify students timetable has been updated

const notifyStudents = async (courseId) => {
  try {
    const students = await StudentEnroll.find({
      enrolledCourses: courseId,
    }).populate({
      path: "studentID",
      model: User,
    });

    const studentEmails = students.map((student) => student.studentID.email);

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "", // Your email address
        pass: "", // Your email password
      },
    });

    // Send reminder email
    let info = await transporter.sendMail({
      from: "", // Sender address
      to: studentEmails, // Scheduled email address
      subject: "Timetable update reminder", // Subject line
      text: `Your timetable has been changed`, // Plain text body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    logger.error(error);
    console.log("Error notifying students: ", error.message);
  }
};

module.exports = {
  addTimetable,
  getTimetablebyCourseIdAndDate,
  getTimetableForCourse,
  updateCourseTimetable,
  deletecourseTimetable,
};
