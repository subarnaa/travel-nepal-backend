import redis from "../../database/initRedis.js";
import User from "../../models/user.js";

// * This route is in many ways similar to confirmSignup
// ! for security reasons no errors will be thrown
export const confirmPassReset = async (req,res) => {
  const { password } = req.body;
  const { id } = req.params;

  try {
    const userId = await redis.get(id);

    // * reset token is invalid
    if (!userId) return res.sendStatus(200);

    const user = await User.findById(userId);

    // * if token exists but user doesn't for some reasons
    if (!user) {
      redis.del(id);
      return res.sendStatus(200);
    }

    // update new password
    user.password = password;
    await user.save();

    // delete reset token
    redis.del(id);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(200);
  }
};
