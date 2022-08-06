import { Post } from "../models/Post";
import { getOrDie, paginate, parseQuery, pick, sort } from "../services/httpService";
import { PrivateFile } from "../models/PrivateFile";
import { Message } from "../models/Message";
import User from "../models/User";

/**
 * POST post.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The user id.
 * @param {Object} req.body - The request body.
 * @param {string=} req.body.sources - An array of posts url or base64 strings.
 * @param {string} req.body.text - The post text.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const postPost = async (req, res) => {
  const { userId } = await getOrDie(req.params, "userId");
  const user = await User.findById(userId);
  const { authorId, text } = await getOrDie(req.body, "authorId", "text");
  const sources = req.body.sources ? req.body.sources.split("&") : undefined;
  const media = sources ? sources.map((src) => new PrivateFile({ src })) : [];
  const content = new Message({ authorId, media, text });
  const post = new Post({ content });

  await user.unshiftPost(post);

  return res.status(200).json({ status: "pass", post });
};

/**
 * GET all posts.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The user id.
 * @param {Object=} req.params.query - The query directives.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const getPosts = async (req, res) => {
  const { userId } = await getOrDie(req.params, "userId");
  const user = await User.findById(userId);
  let { posts } = user;
  const { queryKeys } = await parseQuery(req);

  // pick, paginate or sort?
  if (queryKeys) {
    posts = await pick(posts, queryKeys);
    posts = await paginate(posts, queryKeys);
    posts = await sort(posts, queryKeys);
  }

  return res.status(200).json({ status: "pass", count: posts.length, posts });
};

/**
 * GET post by id.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The user id.
 * @param {string} req.params.postId - The post id.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const getPost = async (req, res) => {
  const { userId, postId } = await getOrDie(req.params, "userId", "postId");
  const { queryKeys } = await parseQuery(req);

  const user = await User.findById(userId);
  let post = await user.posts.id(postId);

  // pick?
  if (queryKeys) {
    post = await pick(post, queryKeys);
  }

  return res.status(200).json({ status: "pass", post });
};

/**
 * PATCH post.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The user id.
 * @param {string} req.params.postId - The post id.
 * @param {Object} req.body - The request body.
 * @param {string=} req.body.caption - The post description.
 * @param {string=} req.body.tag - A tag by which the post could be grouped.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const patchPost = async (req, res) => {
  const { userId, postId } = await getOrDie(req.params, "userId", "postId");
  const user = await User.findById(userId);
  const sources = req.body.sources ? req.body.sources.split(",") : undefined;
  const media = sources ? sources.map((src) => new PrivateFile({ src })) : undefined;
  const { text } = req.body;
  const post = await user.updatePost(postId, { media, text });

  return res.status(200).json({ status: "pass", post });
};

/**
 * DELETE publicPost by id.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.publicPostId - The post id.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const deletePost = async (req, res) => {
  const { userId, postId } = await getOrDie(req.params, "userId", "postId");
  const user = await User.findById(userId);
  const response = await user.removePost(postId);

  return res.status(200).json({ status: "pass", response });
};

export { postPost, getPosts, getPost, patchPost, deletePost };
