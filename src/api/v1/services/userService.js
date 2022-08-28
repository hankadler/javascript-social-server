import fs from "fs";
import config from "../../../config";
import User from "../models/User";
import AuthError from "../errors/AuthError";
import ValueError from "../errors/ValueError";

const file = `${config.root}/data/userIds.json`;

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
    fs.writeFileSync(file, json, { encoding: "utf8" });
  });
};

const readUserIds = () => {
  try {
    return JSON.parse(fs.readFileSync(file, { encoding: "utf8" }));
  } catch {
    return [];
  }
};

export { createUser, writeUserIds, readUserIds };
