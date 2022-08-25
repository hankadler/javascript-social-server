import express from "express";
import voteRouter from "./voteRouter";
import commentRouter from "./commentRouter";
import { postPost, getPosts, getPost, patchPost, deletePost } from "../controllers/postController";

const postRouter = express.Router({ mergeParams: true });

postRouter.route("/")
  .post(postPost)
  .get(getPosts);

postRouter.route("/:postId")
  .get(getPost)
  .patch(patchPost)
  .delete(deletePost);

postRouter.use("/:postId/votes", voteRouter);
postRouter.use("/:postId/comments", commentRouter);

export default postRouter;
