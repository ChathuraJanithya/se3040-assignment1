import express from "express";
import { addSession } from "../controllers/sessionController";

const sessionRouter = express.Router();

sessionRouter.post("/", addSession);

export default sessionRouter;
