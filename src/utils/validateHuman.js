// import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { GOOGLE_RECAPTCHA_SECRET } from "./secrets.js";
import createHttpError from "http-errors";

export const validateHuman = async (
  req,
  _res,
  next
) => {
  const { token } = req.body;
  const googleCaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${GOOGLE_RECAPTCHA_SECRET}&response=${token}`;
  const response = await axios.get(googleCaptchaUrl);
  console.log(token);
  console.log(response.data);
  if (response.data.success) return next();
  throw new createHttpError.NotAcceptable("google recaptcha failed, try again");
};
