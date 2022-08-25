import express from "express";
import voteRouter from "./voteRouter";
import commentRouter from "./commentRouter";
import {
  postFile,
  getFiles,
  getFile,
  patchFile,
  deleteFiles,
  deleteFile
} from "../controllers/mediaController";

const mediaRouter = express.Router({ mergeParams: true });

mediaRouter.route("/")
  .post(postFile)
  .get(getFiles)
  .delete(deleteFiles);

mediaRouter.route("/:fileId")
  .get(getFile)
  .patch(patchFile)
  .delete(deleteFile);

mediaRouter.use("/:fileId/votes", voteRouter);
mediaRouter.use("/:fileId/comments", commentRouter);

export default mediaRouter;
