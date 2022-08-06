import User from "../models/User";
import FieldError from "../errors/FieldError";

/**
 * Gets parent of vote.
 */
const getParent = async (req) => {
  const { userId, fileId, postId, commentId } = req.params;

  const user = await User.findById(userId);

  let parent = [];
  if (fileId && !commentId) {
    // path: users/:userId:/media/:fileId/votes
    parent = await user.media.id(fileId);
  } else if (fileId && commentId) {
    // path: users/:userId:/media/:fileId/comments/:commentId/votes
    parent = await user.media.id(fileId).comments.id(commentId);
  } else if (postId && !commentId) {
    // path: users/:userId:/posts/:postId/votes
    parent = await user.posts.id(postId);
  } else if (postId && commentId) {
    // path: users/:userId:/posts/:postId/comments/:commentId/votes
    parent = await user.posts.id(postId).comments.id(commentId);
  }

  return parent;
};

/**
 * Finds all votes.
 */
const findVotes = async (req) => {
  const { votes } = (await getParent(req)) || [];
  return votes;
};

/**
 * Finds vote by id.
 */
const findVote = async (req) => {
  const { voteId } = req.params;

  if (!voteId) throw new FieldError("'voteId' missing from request parameters!");

  const votes = await findVotes(req);

  return votes.id(voteId);
};

export { getParent, findVotes, findVote };
