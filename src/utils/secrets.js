// get env variables from .env file and export it
// exports because other files dont have to do process.env.VARIABLE
import dotenv from "dotenv";
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;
export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT;
export const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
export const GOOGLE_OAUTH_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const GMAIL_USERNAME = process.env.GMAIL_USERNAME;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
export const GOOGLE_ACCESS_TOKEN = process.env.GOOGLE_ACCESS_TOKEN;
export const GOOGLE_RECAPTCHA_SECRET = process.env
  .GOOGLE_RECAPTCHA_SECRET;
console.log(process.env.GOOGLE_OAUTH_CLIENT_ID)
