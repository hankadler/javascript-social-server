import { Comment } from "../models/Comment";
import { getOrDie } from "../services/httpService";
import { getParent, findComments, findComment } from "../services/commentService";
import { PrivateFile } from "../models/PrivateFile";
import { Message } from "../models/Message";

const postComment = async (req, res) => {
  const { authorId, text } = await getOrDie(req.body, "authorId", "text");
  const sources = req.body.sources ? req.body.sources.split("&") : undefined;
  const media = sources ? sources.map((src) => new PrivateFile({ src })) : [];
  const message = new Message({ authorId, media, text });
  const comment = new Comment({ message });
  const parent = await getParent(req);

  await parent.pushComment(comment);

  return res.status(201).json({ status: "pass", comment });
};

const getComments = async (req, res) => {
  const comments = await findComments(req);
  const count = comments.length;
  return res.status(200).json({ status: "pass", count, comments });
};

const getComment = async (req, res) => (
  res.status(200).json({ status: "pass", comment: await findComment(req) })
);

const patchComment = async (req, res) => {
  const { commentId } = await getOrDie(req.params, "commentId");
  const { text } = await getOrDie(req.body, "text");
  const parent = await getParent(req);
  const comment = await parent.updateComment(commentId, { text });

  return res.status(200).json({ status: "pass", comment });
};

const deleteComment = async (req, res) => {
  const { commentId } = await getOrDie(req.params, "commentId");
  const parent = await getParent(req);
  const response = await parent.removeComment(commentId);

  return res.status(200).json({ status: "pass", response });
};

export { postComment, getComments, getComment, patchComment, deleteComment };
