const app = express();
import express from "express";
import {
  addCourse,
  removeCourse,
  getCourses,
  getCourseById,
  updateCourse,
} from "../controllers/courseController.js";

const courseRouter = express.Router();

courseRouter.get("/", getCourses);
courseRouter.post("/", addCourse);
courseRouter.put("/:id", updateCourse);
courseRouter.delete("/:id", removeCourse);
courseRouter.get("/:id", getCourseById);

export default courseRouter;
