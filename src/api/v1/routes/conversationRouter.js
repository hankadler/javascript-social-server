import express from "express";
import messageRouter from "./messageRouter";
import {
  postConversation,
  getConversations,
  getConversation,
  patchConversation,
  deleteConversation,
  deleteConversations
} from "../controllers/conversationController";

const postRouter = express.Router({ mergeParams: true });

postRouter.route("/")
  .post(postConversation)
  .get(getConversations)
  .delete(deleteConversations);

postRouter.route("/:conversationId")
  .get(getConversation)
  .patch(patchConversation)
  .delete(deleteConversation);

postRouter.use("/:conversationId/messages", messageRouter);

export default postRouter;
