import _ from "lodash";
import User from "../models/User";
import { Conversation } from "../models/Conversation";
import { Message } from "../models/Message";
import { getOrDie, paginate, parseQuery, pick, sort } from "../services/httpService";
import { PrivateFile } from "../models/PrivateFile";

/**
 * POST conversation.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The user id.
 * @param {Object} req.body - The request body.
 * @param {string[]} req.body.to - A comma-delimited string of user ids besides own.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const postConversation = async (req, res) => {
  const { userId: authorId } = await getOrDie(req.params, "userId");
  const author = await User.findById(authorId);
  const to = (await getOrDie(req.body, "to")).to.split(",");
  const recipients = await Promise.all(to.map((recipient) => User.findById(recipient)));
  const participants = [author, ...recipients];
  const participantIds = participants.map(({ _id }) => _id.toString());
  const sources = req.body.sources ? req.body.sources.split("&") : undefined;
  const media = sources ? sources.map((src) => new PrivateFile({ src })) : [];
  const { text } = req.body;
  const message = text ? new Message({ authorId, media, text }) : undefined;
  const messages = message ? [message] : [];

  const conversations = await Promise.all(participants.map((participant) => {
    const matchingConversation = participant.conversations.filter((_conversation) => (
      _.isEqual(_conversation.participantIds, participantIds)
    ))[0];

    const conversation = matchingConversation || new Conversation({ participantIds, messages });

    if (matchingConversation) matchingConversation.pushMessage(message);
    else participant.unshiftConversation(conversation);

    return conversation;
  }));

  return res.status(200).json({ status: "pass", conversation: conversations[0] });
};

/**
 * GET all conversations.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The user id.
 * @param {Object=} req.params.query - The query directives.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const getConversations = async (req, res) => {
  const { userId } = await getOrDie(req.params, "userId");
  const user = await User.findById(userId);
  const { queryKeys } = await parseQuery(req);
  let { conversations } = user;

  // pick, paginate or sort?
  if (queryKeys) {
    conversations = await pick(conversations, queryKeys);
    conversations = await paginate(conversations, queryKeys);
    conversations = await sort(conversations, queryKeys);
  }

  return res.status(200).json({ status: "pass", count: conversations.length, conversations });
};

/**
 * GET conversation by id.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The user id.
 * @param {string} req.params.conversationId - The conversation id.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const getConversation = async (req, res) => {
  const { userId, conversationId } = await getOrDie(req.params, "userId", "conversationId");
  const user = await User.findById(userId);
  const conversation = await user.conversations.id(conversationId);

  return res.status(200).json({ status: "pass", conversation });
};

const patchConversation = async (req, res) => {
  const { userId, conversationId } = await getOrDie(req.params, "userId", "conversationId");
  const user = await User.findById(userId);
  const hasNew = Boolean(req.body.hasNew);
  const conversation = await user.updateConversation(conversationId, { hasNew });

  return res.status(200).json({ status: "pass", conversation });
};

/**
 * DELETE conversation by id.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.conversationId - The conversation id.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const deleteConversation = async (req, res) => {
  const { userId } = await getOrDie(req.params, "userId");
  const user = await User.findById(userId);
  const { conversationId } = req.params;

  const response = await user.removeConversation(conversationId);

  return res.status(200).json({ status: "pass", response });
};

const deleteConversations = async (req, res) => {
  const { userId } = await getOrDie(req.params, "userId");
  const user = await User.findById(userId);
  const { queryKeys } = await parseQuery(req);
  const conversationIds = queryKeys.id.split(",");

  const response = await user.removeConversations(conversationIds);

  return res.status(200).json({ status: "pass", response });
};

export {
  postConversation,
  getConversations,
  getConversation,
  patchConversation,
  deleteConversation,
  deleteConversations
};
