import express from "express";
import { addResource } from "../controllers/resourceController.js";

const resourceRouter = express.Router();

resourceRouter.post("/", addResource);

export default resourceRouter;
