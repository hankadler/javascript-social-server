import mongoose from "mongoose";
import { privateFileSchema } from "./PrivateFile";

const messageSchema = new mongoose.Schema({
  authorId: {
    type: String,
    required: true
  },
  modifiedAt: {
    type: Date,
    default: Date.now
  },
  media: {
    type: [privateFileSchema]
  },
  text: {
    type: String,
    required: true
  }
}, {
  autoCreate: false,
  autoIndex: false
});

const Message = mongoose.model("Message", messageSchema);

export { messageSchema, Message };
