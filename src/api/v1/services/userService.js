import fs from "fs";
import config from "../../../config";
import User from "../models/User";
import AuthError from "../errors/AuthError";
import ValueError from "../errors/ValueError";

const createUser = async (
  name,
  email,
  password,
  passwordAgain,
  activated = false,
  image = "",
  about = "",
  media = [],
  posts = [],
  watchlist = []
) => (
  User.create({
    name, email, password, passwordAgain, activated, image, about, media, posts, watchlist
  }).catch((err) => {
    if (err.code === 11000) {
      throw new AuthError("There's already an account with that email!", 400);
    } else {
      throw new ValueError(err.message, 400);
    }
  })
);

const getUserIds = async () => {
  const userIds = await User.find().select("_id");
  return userIds.map(({ _id }) => _id);
};

const writeUserIds = () => {
  getUserIds().then((ids) => {
    const json = JSON.stringify(ids, null, 2);
    fs.writeFileSync(`${config.root}/data/userIds.json`, json, { encoding: "utf8" });
  });
};

const readUserIds = () => (
  JSON.parse(fs.readFileSync(`${config.root}/data/userIds.json`, { encoding: "utf8" }))
);

export { createUser, writeUserIds, readUserIds };
