import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import {
  GMAIL_USERNAME,
  GOOGLE_ACCESS_TOKEN,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
} from "./secrets.js";

/**
 * * Sends confirmation email on both signup and password reset
 * * uses gmail (customizable)
 * * ejs is a templating engine (pug and handlebars is alternative)
 */

// gmail settings
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: GMAIL_USERNAME,
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    refreshToken: GOOGLE_REFRESH_TOKEN,
    accessToken: GOOGLE_ACCESS_TOKEN,
  },
});

const __dirname = path.resolve(path.dirname(''));
export async function sendConfirmEmail(
  email,
  url,
  action
) {
  // * related to ejs
  console.log(__dirname);
  const data = await ejs.renderFile(__dirname + '/src/views/index.ejs', {
    confirm_link: url,
    confirm_action: action,
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "TravelNepal", // sender address
    to: email,
    subject: action, // Subject line
    text: url, // plain text body
    html: data, // html body
  });

  // for dev env only
  console.log("Message sent: %s", info.messageId);
}
