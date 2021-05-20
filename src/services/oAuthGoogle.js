import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import User from "../models/user.js";

import {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
} from "../utils/secrets.js";
/**
 * *  not verified => delete
 * *  verified add google id
 */

passport.use(
  new Strategy(
    {
      clientID: GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const { _json } = profile;

        const isUser = await User.findOne({ googleId: _json.sub });
        // already registered
        if (isUser) {
          return done(undefined, isUser);
        }

        const email = _json.email;

        const isEmail = await User.findOne({ email });

        // if user already exists with same email and is verified
        // just update the googleId
        if (isEmail && isEmail.verified) {
          isEmail.googleId = _json.sub;
          await isEmail.save();
          return done(undefined, isEmail);
        }

        // delete unverified user
        if (isEmail != null) {
          await User.deleteOne({ email });
        }

        // create new user
        const user = await User.create({
          displayName: _json.name,
          displayPicture: _json.picture,
          email,
          googleId: _json.sub,
          verified: true,
        });

        return done(undefined, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
