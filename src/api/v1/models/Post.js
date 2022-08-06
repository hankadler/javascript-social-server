import mongoose from "mongoose";
import { voteSchema } from "./Vote";
import { commentSchema } from "./Comment";
import { messageSchema } from "./Message";
import ValueError from "../errors/ValueError";

const postSchema = new mongoose.Schema({
  content: {
    type: messageSchema,
    required: true
  },
  votes: {
    type: [voteSchema]
  },
  comments: {
    type: [commentSchema]
  }
}, {
  autoCreate: false,
  autoIndex: false
});

postSchema.methods.pushVote = async function (vote) {
  const userId = vote.voterId;

  if (this.votes.filter(({ voterId }) => voterId === userId).length) {
    throw new ValueError("Cannot vote twice!");
  }

  await this.votes.push(vote);

  this.parent().save();

  return vote;
};

postSchema.methods.updateVote = async function (voteId, { up, why }) {
  const vote = await this.votes.id(voteId);

  vote.up = up;
  vote.why = why;

  this.parent().save();

  return vote;
};

postSchema.methods.removeVote = async function (voteId) {
  let acknowledged = false;
  let deletedCount = 0;

  if (voteId) {
    await this.votes.id(voteId).remove();
    acknowledged = true;
    deletedCount = 1;
  }

  this.parent().save();

  return { acknowledged, deletedCount };
};

postSchema.methods.pushComment = async function (comment) {
  await this.comments.push(comment);

  this.parent().save();

  return comment;
};

postSchema.methods.updateComment = async function (commentId, { text }) {
  const comment = await this.comments.id(commentId);

  comment.message.text = text;

  this.parent().save();

  return comment;
};

postSchema.methods.removeComment = async function (commentId) {
  let acknowledged = false;
  let deletedCount = 0;

  if (commentId) {
    await this.comments.id(commentId).remove();
    acknowledged = true;
    deletedCount = 1;
  }

  this.parent().save();

  return { acknowledged, deletedCount };
};

const Post = mongoose.model("Post", postSchema);

export { postSchema, Post };
