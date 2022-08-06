import express from "express";
// import privateFileRouter from "./privateFileRouter";
import {
  postMessage,
  getMessages,
  getMessage,
  deleteMessage
} from "../controllers/messageController";

const messageRouter = express.Router({ mergeParams: true });

messageRouter.route("/")
  .post(postMessage)
  .get(getMessages);

messageRouter.route("/:messageId")
  .get(getMessage)
  .delete(deleteMessage);

// messageRouter.use("/:messageId/media", privateFileRouter);

export default messageRouter;
