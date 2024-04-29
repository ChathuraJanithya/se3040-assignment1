import express from "express";
import { addBooking } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", addBooking);

export default bookingRouter;
