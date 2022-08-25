import express from "express";
import { getPrivateFiles, getPrivateFile } from "../controllers/privateFileController";

const privateFileRouter = express.Router({ mergeParams: true });

privateFileRouter.route("/")
  .get(getPrivateFiles);

privateFileRouter.route("/:fileId")
  .get(getPrivateFile);

export default privateFileRouter;
