import express from "express";
import { addRole } from "../controllers/roleController.js";

const roleRouter = express.Router();

roleRouter.post("/", addRole);

export default roleRouter;
