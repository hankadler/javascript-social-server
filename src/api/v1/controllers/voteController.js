import { Vote } from "../models/Vote";
import { getOrDie } from "../services/httpService";
import { findVote, findVotes, getParent } from "../services/voteService";

const postVote = async (req, res) => {
  const { voterId, up, why } = await getOrDie(req.body, "voterId", "up", "why");
  const parent = await getParent(req);
  const vote = new Vote({ voterId, up, why });

  await parent.pushVote(vote);

  return res.status(201).json({ status: "pass", vote });
};

const getVotes = async (req, res) => {
  const votes = await findVotes(req);
  const count = votes.length;
  return res.status(200).json({ status: "pass", count, votes });
};

const getVote = async (req, res) => (
  res.status(200).json({ status: "pass", vote: await findVote(req) })
);

const patchVote = async (req, res) => {
  const { voteId } = await getOrDie(req.params, "voteId");
  const { up, why } = await getOrDie(req.body, "up", "why");
  const parent = await getParent(req);
  const vote = await parent.updateVote(voteId, { up, why });

  return res.status(200).json({ status: "pass", vote });
};

const deleteVote = async (req, res) => {
  const { voteId } = await getOrDie(req.params, "voteId");
  const parent = await getParent(req);
  const response = await parent.removeVote(voteId);

  return res.status(200).json({ status: "pass", response });
};

export { postVote, getVotes, getVote, patchVote, deleteVote };
