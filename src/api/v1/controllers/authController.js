import config from "../../../config";
import User from "../models/User";
import AuthError from "../errors/AuthError";
import { getOrDie } from "../services/httpService";
import { createUser } from "../services/userService";
import { sendEmail } from "../services/emailService";
import { setCookie, unsetCookie } from "../services/authService";

/**
 * POST new user and activates account immediately.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.name - The user's name.
 * @param {string} req.body.email - The user's email.
 * @param {string} req.body.password - The user's password.
 * @param {string} req.body.passwordAgain - The user's password confirmation.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */

const signUpNow = async (req, res) => {
  const { name, email, password, passwordAgain } = await getOrDie(
    req.body, "name", "email", "password", "passwordAgain"
  );

  const user = await createUser(name, email, password, passwordAgain, true);

  return res.status(200).json({ status: "pass", message: "Signed up.", userId: user._id });
};

/**
 * POST new user.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.name - The user's name.
 * @param {string} req.body.email - The user's email.
 * @param {string} req.body.password - The user's password.
 * @param {string} req.body.passwordAgain - The user's password confirmation.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */

const signUp = async (req, res) => {
  const { name, email, password, passwordAgain } = await getOrDie(
    req.body, "name", "email", "password", "passwordAgain"
  );

  // create user with un-activated account
  const user = await createUser(name, email, password, passwordAgain, false);

  // create jwt
  const token = await user.signToken("7d");

  // send email with account activation link
  const href = `${config.host}${config.api.path}/auth/activate/${token}`;
  const message = `
    <h3>Social Account Activation</h3>
    <p>Click <a href="${href}">here</a> to activate account.</p>
    <p>Activation window will expire in 7 days.</p>
  `;
  const info = await sendEmail(email, "Activate Social Account", message);

  return res.status(200).json({ status: "pass", message: "Email sent.", info });
};

/**
 * GET token from request parameters and activates user account.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object|void|Response>}
 */

const activate = async (req, res) => {
  const { token } = await getOrDie(req.params, "token");

  // find user by token
  const user = await User.fromToken(token);

  // error out if token is invalid
  if (!user) throw new AuthError("Token invalid or expired!");

  // activate user account
  await User.findByIdAndUpdate(user._id, { activated: true });

  // set cookie
  await setCookie(res, token);

  return res.redirect(301, config.host);
};

/**
 * POST user credentials to sign in.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object|void|Response>}
 */

const signIn = async (req, res) => {
  const { email, password } = await getOrDie(req.body, "email", "password");

  // check account exist and is activated
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AuthError("Invalid credentials!");
  if (!user.activated) throw new AuthError("Account not activated! Check your email.");

  // validate password
  const isPasswordValid = await user.validatePassword(password);
  if (!isPasswordValid) throw new AuthError("Invalid credentials!");

  // sign token
  const token = await user.signToken();

  // set cookie
  await setCookie(res, token);

  return res.status(200).json({ status: "pass", message: "Signed in.", userId: user._id });
};

/**
 * DELETE cookie containing token.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<Object>}
 */

const signOut = async (req, res) => {
  await unsetCookie(res);

  return res.status(200).json({ status: "pass", message: "Signed out." });
};

export { signUpNow, signUp, activate, signIn, signOut };
