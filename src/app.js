import cors from "cors";
import express from "express";
import morgan from "morgan";
import config from "./config";
import handleError from "./wares/handleError";
import authRouter from "./api/v1/routes/authRouter";
import userRouter from "./api/v1/routes/userRouter";
import staticRoutes from "./api/v1/routes/staticRoutes";

const app = express();

/* wares */
if (config.env === "dev") app.use(morgan("dev"));
app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: false, limit: "16mb" }));
app.use(cors());

/* routes */
staticRoutes.forEach((route) => app.use(route, express.static("../client/dist")));
app.use(`${config.api.path}/auth`, authRouter);
app.use(`${config.api.path}/users`, userRouter);
app.use(handleError(config.env));

export default app;
