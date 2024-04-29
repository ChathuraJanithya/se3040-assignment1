import express from "express";

import { addFaculty } from "../controllers/facultyController.js";

const facultyRouter = express.Router();

facultyRouter.post("/", addFaculty);

export default facultyRouter;
