import User from "../models/User";
import { getOrDie, paginate, parseQuery, pick, sort } from "../services/httpService";

/**
 * GET all users.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const getUsers = async (req, res) => {
  const { queryKeys } = await parseQuery(req);

  let users = await User.find();

  // pick, paginate or sort?
  if (queryKeys) {
    users = await pick(users, queryKeys);
    users = await paginate(users, queryKeys);
    users = await sort(users, queryKeys);
  }

  return res.status(200).json({ status: "pass", count: users.length, users });
};

/**
 * GET user by id.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The {@link User} object's _id property value.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const getUser = async (req, res) => {
  const { userId } = await getOrDie(req.params, "userId");
  const { queryKeys } = await parseQuery(req);

  let user = await User.findById(userId);

  // pick?
  if (queryKeys) {
    user = await pick(user, queryKeys);
  }

  return res.status(200).json({ status: "pass", user });
};

/**
 * PATCH user's email and/or password.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The {@link User} object's _id property value.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.email - The user's new email.
 * @param {string} req.body.password - The user's new password.
 * @param {string} req.body.passwordAgain - The user's new password confirmation.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const patchUser = async (req, res) => {
  const { userId } = await getOrDie(req.params, "userId");
  const { name, email, password, passwordAgain, image, about, watchlist } = req.body;

  let user = await User.findById(userId);
  // todo: make this less expensive
  if (name) user = await User.findByIdAndUpdate(userId, { name });
  if (email) user = await User.findByIdAndUpdate(userId, { email });
  if (password) await user.hashPassword(password, passwordAgain);
  if (image) user = await User.findByIdAndUpdate(userId, { image });
  if (about) user = await User.findByIdAndUpdate(userId, { about });
  if (watchlist !== undefined) {
    user = await User.findByIdAndUpdate(
      userId, { watchlist: watchlist ? watchlist.split(",") : [] }
    );
  }

  return res.status(200).json({ status: "pass", user });
};

/**
 * DELETE user by id.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The {@link User} object's _id property value.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const deleteUser = async (req, res) => {
  const { userId } = await getOrDie(req.params, "userId");
  const response = await User.deleteOne({ _id: userId });

  return res.status(200).json({ status: "pass", response });
};

export { getUsers, getUser, patchUser, deleteUser };
