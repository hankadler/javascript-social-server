import cookie from "cookie";
import config from "../../../config";

const unsetCookie = async (res) => {
  res.setHeader("Set-Cookie", cookie.serialize("token", "", { sameSite: true }));
};

const setCookie = async (res, token) => {
  const cookieOptions = {
    path: config.api.path,
    maxAge: parseInt(config.cookieMaxAge, 10),
    httpOnly: true,
    sameSite: "strict",
    secure: config.env === "prod"
  };
  await unsetCookie(res);
  res.setHeader("Set-Cookie", cookie.serialize("token", token, cookieOptions));
};

export { unsetCookie, setCookie };
