import mongoose from "mongoose";
import _ from "lodash";
import { voteSchema } from "./Vote";
import { commentSchema } from "./Comment";
import ValueError from "../errors/ValueError";

const publicFileSchema = new mongoose.Schema({
  src: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    trim: true,
    maxLength: 280
  },
  tag: {
    type: String,
    default: "",
    trim: true,
    maxLength: 16,
    set: (str) => _.startCase(_.camelCase(str))
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

publicFileSchema.methods.pushVote = async function (vote) {
  const userId = vote.voterId;

  if (this.votes.filter(({ voterId }) => voterId === userId).length) {
    throw new ValueError("Cannot vote twice!");
  }

  await this.votes.push(vote);

  this.parent().save();

  return vote;
};

publicFileSchema.methods.updateVote = async function (voteId, { up, why }) {
  const vote = await this.votes.id(voteId);

  vote.up = up;
  vote.why = why;

  this.parent().save();

  return vote;
};

publicFileSchema.methods.removeVote = async function (voteId) {
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

publicFileSchema.methods.pushComment = async function (comment) {
  await this.comments.push(comment);

  this.parent().save();

  return comment;
};

publicFileSchema.methods.updateComment = async function (commentId, { text }) {
  const comment = await this.comments.id(commentId);

  comment.message.text = text;

  this.parent().save();

  return comment;
};

publicFileSchema.methods.removeComment = async function (commentId) {
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

const PublicFile = mongoose.model("PublicFile", publicFileSchema);

export { publicFileSchema, PublicFile };
