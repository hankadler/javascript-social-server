import mongoose from "mongoose";
import _ from "lodash";

const voteSchema = new mongoose.Schema({
  modifiedAt: {
    type: Date,
    default: Date.now
  },
  voterId: {
    type: String,
    required: true
  },
  up: {
    type: Boolean,
    required: true
  },
  why: {
    type: String,
    required: true,
    enum: ["Good", "True", "Right", "Bad", "False", "Wrong"],
    set: (str) => _.startCase(_.lowerCase(str))
  }
}, {
  autoCreate: false,
  autoIndex: false
});

const Vote = mongoose.model("Vote", voteSchema);

export { voteSchema, Vote };
