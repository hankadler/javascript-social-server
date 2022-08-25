import express from "express";
import { getUsers, getUser, patchUser, deleteUser } from "../controllers/userController";
import mediaRouter from "./mediaRouter";
import postRouter from "./postRouter";
import conversationRouter from "./conversationRouter";
import restrictAccess from "../../../wares/restrictAccess";

const userRouter = express.Router();

userRouter.route("/")
  .get(restrictAccess(), getUsers);

userRouter.route("/:userId")
  .get(restrictAccess(), getUser)
  .patch(restrictAccess(), patchUser)
  .delete(restrictAccess(), deleteUser);

userRouter.use("/:userId/media", restrictAccess(), mediaRouter);
userRouter.use("/:userId/posts", restrictAccess(), postRouter);
userRouter.use("/:userId/conversations", restrictAccess(), conversationRouter);

export default userRouter;
