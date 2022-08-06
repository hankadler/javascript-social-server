import cors from "cors";
import express from "express";
import morgan from "morgan";
import config from "./config";
import restrictAccess from "./wares/restrictAccess";
import handleError from "./wares/handleError";
import authRouter from "./api/v1/routers/authRouter";
import userRouter from "./api/v1/routers/userRouter";

const app = express();

/* wares */
if (config.env === "dev") app.use(morgan("dev"));
app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: false, limit: "16mb" }));
app.use(cors());

/* routes */
app.use(express.static("../client/dist"));
app.get("/", (req, res) => res.status(200).json({ status: "pass" }));
app.get(config.api.path, (req, res) => res.status(200).json({ status: "pass" }));
app.use(`${config.api.path}/auth`, authRouter);
app.use(restrictAccess());
app.use(`${config.api.path}/users`, userRouter);
app.use(handleError(config.env));

export default app;
