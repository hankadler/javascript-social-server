import User from "../models/User";
import FieldError from "../errors/FieldError";

/**
 * Gets parent of comment.
 */
const getParent = async (req) => {
  const { userId, fileId, postId } = req.params;

  const user = await User.findById(userId);

  let parent = [];
  if (fileId) {
    // path: users/:userId:/media/:fileId/comments
    parent = await user.media.id(fileId);
  } else if (postId) {
    // path: users/:userId:/posts/:postId/comments
    parent = await user.posts.id(postId);
  }

  return parent;
};

/**
 * Finds all comments.
 */
const findComments = async (req) => (await getParent(req)).comments;

/**
 * Finds comment by id.
 */
const findComment = async (req) => {
  const { commentId } = req.params;

  if (!commentId) throw new FieldError("'commentId' missing from request parameters!");

  const comments = await findComments(req);

  return comments.id(commentId);
};

export { getParent, findComments, findComment };
