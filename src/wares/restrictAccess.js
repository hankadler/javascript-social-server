import cookie from "cookie";
import AuthError from "../api/v1/errors/AuthError";
import User from "../api/v1/models/User";

const restrictAccess = () => async (req, res, next) => {
  const { token } = cookie.parse(req.headers.cookie || "");

  if (!token) throw new AuthError("Unauthorized!");

  const isAuthorized = await User.validateToken(token);
  if (!isAuthorized) throw new AuthError("Unauthorized!");

  return next();
};

export default restrictAccess;
