import User from "../../models/user.js";
import { createResetUrl } from "../../utils/createConfirmUrl.js";
import { sendConfirmEmail } from "../../utils/sendConfirmEmail.js";

const createEmailandSend = async (id, userEmail) => {
  // TODO: Find a way to send domain automatically

  const url = await createResetUrl(id);
  await sendConfirmEmail(userEmail, url, "Confirm Password Reset");
};

export const reqPassReset = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!(user && user.verified)) return res.sendStatus(200);

  // * not awaiting to send response faster
  createEmailandSend(user.id, email);
  res.sendStatus(200);
};
