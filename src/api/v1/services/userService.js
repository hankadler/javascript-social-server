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

export { createUser };
