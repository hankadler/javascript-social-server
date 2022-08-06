import _ from "lodash";
import { getOrDie } from "../services/httpService";
import { PrivateFile } from "../models/PrivateFile";
import { Message } from "../models/Message";
import User from "../models/User";

const postMessage = async (req, res) => {
  const { userId, conversationId } = await getOrDie(req.params, "userId", "conversationId");
  const sources = req.body.sources ? req.body.sources.split("&") : undefined;
  const media = sources ? sources.map((src) => new PrivateFile({ src })) : undefined;
  const { text } = await getOrDie(req.body, "text");
  const conversation = (await User.findById(userId)).conversations.id(conversationId);
  const { participantIds } = conversation;
  const participants = await Promise.all(participantIds.map((id) => User.findById(id)));

  const message = new Message({ authorId: userId, media, text });

  // await conversation.pushMessage(message);
  await Promise.all(
    participants.map(({ conversations }) => (
      conversations.map((_conversation) => (
        _.isEqual(_conversation.participantIds, participantIds)
          ? _conversation.pushMessage(message)
          : null
      ))
    ))
  );

  return res.status(200).json({ status: "pass", message });
};

const getMessages = async (req, res) => {
  const { userId, conversationId } = await getOrDie(req.params, "userId", "conversationId");
  const { messages } = (await User.findById(userId)).conversations.id(conversationId);

  return res.status(200).json({ status: "pass", count: messages.length, messages });
};

const getMessage = async (req, res) => {
  const { userId, conversationId, messageId } = (
    await getOrDie(req.params, "userId", "conversationId", "messageId")
  );
  const message = (await User.findById(userId))
    .conversations.id(conversationId).messages.id(messageId);

  return res.status(200).json({ status: "pass", message });
};

const deleteMessage = async (req, res) => {
  const { userId, conversationId, messageId } = (
    await getOrDie(req.params, "userId", "conversationId", "messageId")
  );
  const conversation = (await User.findById(userId)).conversations.id(conversationId);
  const response = await conversation.removeMessage(messageId);

  return res.status(200).json({ status: "pass", response });
};

export { postMessage, getMessages, getMessage, deleteMessage };
