// import { Request, Response } from "express";
import redis from "../../database/initRedis.js";
import User from "../../models/user.js";

// ! for security reasons just redirect
export const confirmSignup = async (req, res) => {
  const { id } = req.params;
  try {
    const userId = await redis.get(id);

    // if redis token doesn't exists
    // * either already verified or invalid confirm id

    if (!userId) return res.redirect("/login");

    const user = await User.findById(userId);

    // * if token exists for already deleted user
    // * like when u send multiple verification with same email
    if (!user) {
      redis.del(id);
      return res.redirect("/email/confirm");
    }

    // verify user | delete redis token | redirect to login
    user.verified = true;
    await user.save();
    redis.del(id);
    res.redirect("http://localhost:3000/email/confirm");
  } catch (error) {
    res.redirect("/email/confirm");
  }
};
