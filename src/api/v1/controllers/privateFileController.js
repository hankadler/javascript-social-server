import { getOrDie, paginate, parseQuery, pick, sort } from "../services/httpService";
import User from "../models/User";

/**
 * GET all files.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The user id.
 * @param {Object=} req.params.query - The query directives.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const getFiles = async (req, res) => {
  const { userId } = await getOrDie(req.params, "userId");
  const user = await User.findById(userId);
  const { queryKeys } = await parseQuery(req);

  // filter?
  let media = await user.findMediaByTag(req.query);

  // pick, paginate or sort?
  if (queryKeys) {
    media = await pick(media, queryKeys);
    media = await paginate(media, queryKeys);
    media = await sort(media, queryKeys);
  }

  return res.status(200).json({ status: "pass", count: media.length, media });
};

/**
 * GET media file by id.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The user id.
 * @param {string} req.params.fileId - The file id.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const getFile = async (req, res) => {
  const { userId, fileId } = await getOrDie(req.params, "userId", "fileId");
  const user = await User.findById(userId);
  const file = await user.media.id(fileId);

  return res.status(200).json({ status: "pass", file });
};

export { getFiles, getFile };
