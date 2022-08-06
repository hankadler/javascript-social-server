/**
 * Find message by id.
 */
import { getOrDie } from "./httpService";
import User from "../models/User";

const findMessage = async (req) => {
  const { userId, conversationId, messageId } = (
    getOrDie(req.params, "userId", "conversationId", "messageId")
  );

  const user = await User.findById(userId);

  return user.conversations.id(conversationId).messages.id(messageId);
};

export { findMessage };
