import { createTransport } from "nodemailer";
import config from "../../../config";

/**
 * Sends email.
 *
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject matter.
 * @param {string} message - The email message.
 * @param {boolean} isPlain - Indicates whether the message is plain (true) or rich text (false).
 * @returns {Promise<string|any|void>}
 */
const sendEmail = async (to, subject, message, isPlain = false) => {
  // (1) Set to outlook defaults, since gmail no longer allows connections of this kind
  const transporter = createTransport({
    host: config.emailHost,
    port: parseInt(config.emailPort, 10),
    secure: false, // (1)
    tls: {
      ciphers: "SSLv3" // (1)
    },
    auth: {
      user: config.emailUser,
      pass: config.emailPass
    }
  });

  const mailOptions = {
    from: `<${config.emailUser}>`,
    replyTo: `noreply@${config.emailUser.split("@").slice(-1)}`,
    to,
    subject
  };

  if (isPlain) {
    mailOptions.text = message;
  } else {
    mailOptions.html = message;
  }

  return transporter.sendMail(mailOptions);
};

export { sendEmail };
