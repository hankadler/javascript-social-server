import express from "express";
import { getUsers, getUser, patchUser, deleteUser } from "../controllers/userController";
import mediaRouter from "./mediaRouter";
import postRouter from "./postRouter";
import conversationRouter from "./conversationRouter";

const userRouter = express.Router();

userRouter.route("/")
  .get(getUsers);

userRouter.route("/:userId")
  .get(getUser)
  .patch(patchUser)
  .delete(deleteUser);

userRouter.use("/:userId/media", mediaRouter);
userRouter.use("/:userId/posts", postRouter);
userRouter.use("/:userId/conversations", conversationRouter);

export default userRouter;
