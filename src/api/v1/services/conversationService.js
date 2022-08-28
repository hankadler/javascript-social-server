import fs from "fs";
import _ from "lodash";
import config from "../../../config";
import User from "../models/User";
import { getOrDie } from "./httpService";

const file = `${config.root}/data/conversationIds.json`;

/**
 * Find message by id.
 */
const findMessage = async (req) => {
  const { userId, conversationId, messageId } = (
    getOrDie(req.params, "userId", "conversationId", "messageId")
  );
  const user = await User.findById(userId);
  return user.conversations.id(conversationId).messages.id(messageId);
};

const getConversationIds = async () => {
  const users = await User.find().select("conversations");
  return _.flattenDeep(users
    .filter(({ conversations }) => conversations.length)
    .map(({ conversations }) => conversations.map(({ _id }) => _id)));
};

const writeConversationIds = () => {
  getConversationIds().then((ids) => {
    const json = JSON.stringify(ids, null, 2);
    fs.writeFileSync(file, json, { encoding: "utf8" });
  });
};

const readConversationIds = () => {
  try {
    return JSON.parse(fs.readFileSync(file, { encoding: "utf8" }));
  } catch {
    return [];
  }
};

export { findMessage, writeConversationIds, readConversationIds };
