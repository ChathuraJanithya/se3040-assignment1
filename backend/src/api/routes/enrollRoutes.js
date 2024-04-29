import express from "express";
import {
  enrollStudent,
  getEnrollemtsByStudent,
  getEnrolledCourseTimetable,
} from "../controllers/enrollController.js";

const enrollRouter = express.Router();

enrollRouter.post("/", enrollStudent);
enrollRouter.get("/", getEnrollemtsByStudent);
enrollRouter.get("/timetable", getEnrolledCourseTimetable);

export default enrollRouter;
