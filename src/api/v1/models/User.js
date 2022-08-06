import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../../config";
import { publicFileSchema } from "./PublicFile";
import { postSchema } from "./Post";
import { conversationSchema } from "./Conversation";
import AuthError from "../errors/AuthError";
import FieldError from "../errors/FieldError";
import ValueError from "../errors/ValueError";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 32,
    validate: [
      (str) => validator.isAlpha(str, "en-US", { ignore: " -" }),
      "can only contain letters, spaces and hyphens!"
    ]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "is not valid!"]
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 12,
    select: false
  },
  passwordModifiedAt: {
    type: String,
    default: Math.floor(Date.now() / 1000).toString(),
    select: false
  },
  activated: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: ""
  },
  about: {
    type: String,
    default: "",
    trim: true,
    maxLength: 280
  },
  media: {
    type: [publicFileSchema]
  },
  posts: {
    type: [postSchema]
  },
  conversations: {
    type: [conversationSchema]
  },
  watchlist: {
    type: Array,
    default: []
  }
});

userSchema.virtual("passwordAgain");

/**
 * Ensures password gets hashed before it is saved.
 */
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) await this.hashPassword(this.password, this.passwordAgain);

  return next();
});

/**
 * Finds user by JSON Web Token payload id.
 *
 * @param {string} token - A JSON Web Token.
 * @returns {Promise<User>} - The user found.
 * @throws {AuthError} - If token is invalid or no user is found by id.
 */
userSchema.statics.fromToken = async function (token) {
  // is token signature correct?
  const payload = await jwt.verify(token, config.jwtSecret);
  if (!payload) throw new AuthError("Invalid token signature!");

  // get user from payload id
  const user = await this.findById(payload.id);
  if (!user) throw new AuthError("Invalid token payload!");

  return user;
};

/**
 * Validates JSON Web Token.
 *
 * @param {string} token - A JSON Web Token.
 * @returns {Promise<boolean>} - Boolean indicating its validity.
 * @throws {AuthError} - If token is invalid.
 */
userSchema.statics.validateToken = async function (token) {
  // is token signature correct?
  const payload = await jwt.verify(token, config.jwtSecret);
  if (!payload) throw new AuthError("Invalid token signature!");

  // get user from payload id
  const user = await this.findById(payload.id).select("+passwordModifiedAt");
  if (!user) throw new AuthError("Invalid token payload!");

  // is token newer than password?
  const tokenIssuedAt = new Date(parseInt(payload.iat, 10) * 1000);
  const passwordModifiedAt = new Date(parseInt(user.passwordModifiedAt, 10) * 1000);
  const isTokenUpToDate = tokenIssuedAt.getTime() > passwordModifiedAt.getTime();
  if (!isTokenUpToDate) throw new AuthError("Token expired!");

  return true;
};

/**
 * Validates password.
 *
 * @param {string} password - The password given as the user's.
 * @returns {Promise<boolean>} - Boolean indicating its validity.
 */
userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

/**
 * Hashes the password.
 *
 * @param {string} password - The password given as the user's.
 * @param {string} passwordAgain - The password confirmation.
 * @returns {Promise<void>}
 * @throws {FieldError} - If password or passwordAgain are not given.
 * @throws {ValueError} - If password and passwordAgain don't match.
 */
userSchema.methods.hashPassword = async function (password, passwordAgain) {
  if (!password) throw new FieldError("Request body is missing 'password' key!");
  if (!passwordAgain) throw new FieldError("Request body is missing 'passwordAgain' key!");
  if (password !== passwordAgain) throw new ValueError("Passwords don't match!");
  this.password = await bcrypt.hash(password, 12);
  this.passwordModifiedAt = Math.floor(Date.now() / 1000).toString();
};

/**
 * Returns a JSON Web Token (JWT) containing the user id, secret and expiration.
 *
 * @param {string} expiresIn - Time until JWT expiration (e.g. 1h).
 * @returns {Promise<string>} - The JWT string.
 */
userSchema.methods.signToken = async function (expiresIn = config.jwtExpiresIn) {
  return jwt.sign({ id: this._id }, config.jwtSecret, { expiresIn });
};

userSchema.methods.findMediaByTag = async function (query) {
  const { tag } = query;

  return tag ? this.media.filter((file) => file.tag === tag) : this.media;
};

userSchema.methods.unshiftFile = async function (file) {
  await this.media.unshift(file);

  return this.save();
};

/**
 * Updates file by id.
 *
 * @param {string} fileId - The file id.
 * @param {string=} caption - The file description.
 * @param {string=} tag - A label by which the file can be grouped.
 * @returns {Promise<File>} - The updated file.
 */
userSchema.methods.updateFile = async function (fileId, { caption, tag }) {
  const file = await this.media.id(fileId);

  if (caption || caption === "") file.caption = caption;
  if (tag || tag === "") file.tag = tag;

  this.save();

  return file;
};

/**
 * Removes files with given tag, or all files if no tag is specified.
 *
 * @param {Object} query - Typically, a req.query object.
 * @param {Object} query.tag - The tag by which to filter files.
 * @returns {Promise<Object>}
 */
userSchema.methods.removeFiles = async function (query) {
  const { tag } = query;

  const beforeLength = this.media.length;

  this.media = tag ? this.media.filter((file) => file.tag !== tag) : [];
  this.save();

  const afterLength = this.media.length;
  const deletedCount = beforeLength - afterLength;

  return { acknowledged: deletedCount > 0, deletedCount };
};

/**
 * Removes file by id.
 *
 * @param {string} fileId - The file id.
 * @returns {Promise<{acknowledged: boolean, deletedCount: number}>}
 */
userSchema.methods.removeFile = async function (fileId) {
  let acknowledged = false;
  let deletedCount = 0;

  if (fileId) {
    await this.media.id(fileId).remove();
    acknowledged = true;
    deletedCount = 1;
    this.save();
  }

  return { acknowledged, deletedCount };
};

userSchema.methods.unshiftPost = async function (post) {
  await this.posts.unshift(post);

  return this.save();
};

userSchema.methods.updatePost = async function (postId, { media, text }) {
  const post = await this.posts.id(postId);

  if (media) post.content.media = media;
  if (text) post.content.text = text;

  if (media || text) post.content.modifiedAt = Date.now();

  this.save();

  return post;
};

/**
 * Removes post by id.
 *
 * @param {string} postId - The post id.
 * @returns {Promise<{acknowledged: boolean, deletedCount: number}>}
 */
userSchema.methods.removePost = async function (postId) {
  let acknowledged = false;
  let deletedCount = 0;

  if (postId) {
    await this.posts.id(postId).remove();
    acknowledged = true;
    deletedCount = 1;
  }

  this.save();

  return { acknowledged, deletedCount };
};

userSchema.methods.unshiftConversation = async function (conversation) {
  await this.conversations.unshift(conversation);

  return this.save();
};

userSchema.methods.updateConversation = async function (conversationId, { hasNew }) {
  const conversation = await this.conversations.id(conversationId);

  conversation.hasNew = hasNew;

  this.save();

  return conversation;
};

/**
 * Removes conversation by id.
 *
 * @param {string} conversationId - The conversation id.
 * @returns {Promise<{acknowledged: boolean, deletedCount: number}>}
 */
userSchema.methods.removeConversation = async function (conversationId) {
  let acknowledged = false;
  let deletedCount = 0;

  if (conversationId) {
    await this.conversations.id(conversationId).remove();
    acknowledged = true;
    deletedCount = 1;
  }

  this.save();

  return { acknowledged, deletedCount };
};

/**
 * Removes conversation by id.
 *
 * @param {array} conversationIds - The conversation ids.
 * @returns {Promise<{acknowledged: boolean, deletedCount: number}>}
 */
userSchema.methods.removeConversations = async function (conversationIds) {
  let deletedCount = 0;

  await Promise.all(
    conversationIds.map((conversationId) => {
      deletedCount += 1;
      return this.conversations.id(conversationId).remove();
    })
  );

  const acknowledged = Boolean(deletedCount);

  this.save();

  return { acknowledged, deletedCount };
};

const User = mongoose.model("User", userSchema);

export default User;
