import mongoose from "mongoose";
import { messageSchema } from "./Message";

const conversationSchema = new mongoose.Schema({
  participantIds: {
    type: [String],
    required: true
  },
  messages: {
    type: [messageSchema],
    default: []
  },
  hasNew: {
    type: Boolean,
    default: false
  }
}, {
  autoCreate: false,
  autoIndex: false
});

conversationSchema.methods.pushMessage = async function (message) {
  await this.messages.push(message);
  this.hasNew = true;

  return this.parent().save();
};

conversationSchema.methods.removeMessage = async function (messageId) {
  let acknowledged = false;
  let deletedCount = 0;

  if (messageId) {
    await this.messages.id(messageId).remove();
    acknowledged = true;
    deletedCount = 1;
  }

  this.parent().parent().save();

  return { acknowledged, deletedCount };
};

const Conversation = mongoose.model("Conversation", conversationSchema);

export { conversationSchema, Conversation };
