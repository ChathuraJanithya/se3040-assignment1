import express from "express";
import {
  addTimetable,
  getTimetablebyCourseIdAndDate,
  getTimetableForCourse,
  updateCourseTimetable,
  deletecourseTimetable,
} from "../controllers/timetableController.js";

const timetableRouter = express.Router();

timetableRouter.post("/", addTimetable);
timetableRouter.get("/", getTimetablebyCourseIdAndDate);
timetableRouter.get("/:id", getTimetableForCourse);
timetableRouter.put("/:id", updateCourseTimetable);
timetableRouter.delete("/:id", deletecourseTimetable);

export default timetableRouter;
