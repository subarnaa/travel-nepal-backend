import createError from "http-errors";
import User from "../../models/user.js";
import { createConfirmUrl } from "../../utils/createConfirmUrl.js";
import { sendConfirmEmail } from "../../utils/sendConfirmEmail.js";

const createEmailandSend = async (id, userEmail) => {
  // TODO: Find a way to send domain automatically

  const url = await createConfirmUrl(id);
  await sendConfirmEmail(userEmail, url, "Confirm Email");
};

/**
 * ! There are lots of edge cases
 * TODO: Improve as you go
 */

export const signupRoute = async (req, res) => {
  const { email, password, displayName } = req.body;
  const isUser = await User.findOne({ email });

  //  if user exists and is verified
  // (isUser && isUser.verified)
  if (isUser && isUser.verified)
    throw new createError.NotAcceptable("User already exists");

  // if user exists but not verified
  //* delete old user and send verification again
  if (isUser != null) {
    await User.deleteOne({ email });
  }

  // if user doesn't exist
  const displayNameForUrl = displayName.split(" ").join("+");
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const dpSize = 96;
  const displayPicture = `https://ui-avatars.com/api/?name=${displayNameForUrl}&background=${randomColor}&size=${dpSize}`;

  const user = await User.create({
    email,
    password,
    displayName,
    displayPicture,
  });

  // * Not awaiting to send response faster

  createEmailandSend(user.id, email);
  res.sendStatus(200);
};
