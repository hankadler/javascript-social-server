import express from "express";
import { postVote, getVotes, getVote, patchVote, deleteVote } from "../controllers/voteController";

const voteRouter = express.Router({ mergeParams: true });

voteRouter.route("/")
  .post(postVote)
  .get(getVotes);

voteRouter.route("/:voteId")
  .get(getVote)
  .patch(patchVote)
  .delete(deleteVote);

export default voteRouter;
