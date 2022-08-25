import express from "express";
import voteRouter from "./voteRouter";
import {
  postComment,
  getComments,
  getComment,
  patchComment,
  deleteComment
} from "../controllers/commentController";

const commentRouter = express.Router({ mergeParams: true });

commentRouter.route("/")
  .post(postComment)
  .get(getComments);

commentRouter.route("/:commentId")
  .get(getComment)
  .patch(patchComment)
  .delete(deleteComment);

commentRouter.use("/:commentId/votes", voteRouter);

export default commentRouter;
