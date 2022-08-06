import { PublicFile } from "../models/PublicFile";
import { getOrDie, paginate, parseQuery, pick, sort } from "../services/httpService";
import User from "../models/User";

/**
 * POST media file.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The user id.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.src - The file url or base64 string.
 * @param {string} req.body.caption - The file description.
 * @param {string=} req.body.tag - A tag by which the file could be grouped.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const postFile = async (req, res) => {
  const { userId } = await getOrDie(req.params, "userId");
  const user = await User.findById(userId);
  const { src, caption } = await getOrDie(req.body, "src", "caption");
  const { tag } = req.body;
  const file = new PublicFile({ src, tag, caption });

  await user.unshiftFile(file);

  return res.status(200).json({ status: "pass", file });
};

/**
 * GET all media files.
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
  const { userId } = await getOrDie(req.params, "userId");
  const user = await User.findById(userId);
  const { fileId } = req.params;
  const file = await user.media.id(fileId);

  return res.status(200).json({ status: "pass", file });
};

/**
 * PATCH media file.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.userId - The user id.
 * @param {string} req.params.fileId - The file id.
 * @param {Object} req.body - The request body.
 * @param {string=} req.body.caption - The file description.
 * @param {string=} req.body.tag - A tag by which the file could be grouped.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const patchFile = async (req, res) => {
  const { userId } = await getOrDie(req.params, "userId");
  const user = await User.findById(userId);
  const { fileId } = await getOrDie(req.params, "fileId");
  const { caption, tag } = req.body;
  const file = await user.updateFile(fileId, { caption, tag });

  return res.status(200).json({ status: "pass", file });
};

const deleteFiles = async (req, res) => {
  const { userId } = await getOrDie(req.params, "userId");
  const user = await User.findById(userId);
  const response = await user.removeFiles(req.query);

  return res.status(200).json({ status: "pass", response });
};

/**
 * DELETE publicFile by id.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.publicFileId - The file id.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */
const deleteFile = async (req, res) => {
  const { userId } = await getOrDie(req.params, "userId");
  const user = await User.findById(userId);
  const { fileId } = req.params;
  const response = await user.removeFile(fileId);

  return res.status(200).json({ status: "pass", response });
};

export { postFile, getFiles, getFile, patchFile, deleteFiles, deleteFile };
