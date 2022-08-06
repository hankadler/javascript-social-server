import mongoose from "mongoose";
import { voteSchema } from "./Vote";
import { messageSchema } from "./Message";
import ValueError from "../errors/ValueError";

const commentSchema = new mongoose.Schema({
  message: {
    type: messageSchema,
    required: true
  },
  votes: {
    type: [voteSchema]
  }
}, {
  autoCreate: false,
  autoIndex: false
});

commentSchema.methods.pushVote = async function (vote) {
  const userId = vote.voterId;

  if (this.votes.filter(({ voterId }) => voterId === userId).length) {
    throw new ValueError("Cannot vote twice!");
  }

  await this.votes.push(vote);

  this.parent().parent().save();

  return vote;
};

commentSchema.methods.updateVote = async function (voteId, { up, why }) {
  const vote = await this.votes.id(voteId);

  vote.up = up;
  vote.why = why;

  this.parent().parent().save();

  return vote;
};

commentSchema.methods.removeVote = async function (voteId) {
  let acknowledged = false;
  let deletedCount = 0;

  if (voteId) {
    await this.votes.id(voteId).remove();
    acknowledged = true;
    deletedCount = 1;
  }

  this.parent().parent().save();

  return { acknowledged, deletedCount };
};

const Comment = mongoose.model("Comment", commentSchema);

export { commentSchema, Comment };
