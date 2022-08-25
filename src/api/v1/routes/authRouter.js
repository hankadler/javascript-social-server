import express from "express";
import { signUpNow, signUp, activate, signIn, signOut } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/sign-up-now", signUpNow);
authRouter.post("/sign-up", signUp);
authRouter.get("/activate/:token", activate);
authRouter.post("/sign-in", signIn);
authRouter.delete("/sign-out", signOut);

export default authRouter;
