import express from "express";
import cors from "cors"; //cross-origin resource sharing : access control
import logger from "./utils/logger"; //UTILS
import "dotenv/config";
import bodyParser from "body-parser";
import { connect } from "./utils/database.connection";
import { AuthGuard } from "./api/middleware/auth-guard.js";

const app = express();
const PORT = process.env.PORT || "8090";

app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "20mb" }));

app.use(AuthGuard);
app.get("/", (req, res, next) => {
  res.send("<h2>Timetable Management System</h2>");
  next();
});

//user
import userRouter from "./api/routes/userRoutes.js";
app.use("/user", userRouter);

//course
import courseRouter from "./api/routes/courseRoutes.js";
app.use("/course", courseRouter);

//faculty
import facultyRouter from "./api/routes/facultyRoutes.js";
app.use("/faculty", facultyRouter);

//timeslot
import timetableRouter from "./api/routes/TimetableRoutes.js";
app.use("/timetable", timetableRouter);

//role
import roleRouter from "./api/routes/roleRoutes.js";
app.use("/role", roleRouter);

//session
import sessionRouter from "./api/routes/sessionRoute.js";
app.use("/session", sessionRouter);

//room
import roomRouter from "./api/routes/roomRoutes.js";
app.use("/room", roomRouter);

//resource
import resourceRouter from "./api/routes/resourceRoutes.js";
app.use("/resource", resourceRouter);

//booking
import bookingRouter from "./api/routes/bookingRoutes.js";
app.use("/booking", bookingRouter);

//enroll
import enrollRouter from "./api/routes/enrollRoutes.js";
app.use("/enroll", enrollRouter);

app.listen(PORT, () => {
  logger.info(`Server is up and running on ${PORT}`);
  connect();
});
