import express from "express";
import { addRoom } from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/", addRoom);

export default roomRouter;
