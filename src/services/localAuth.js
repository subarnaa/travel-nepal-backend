import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import createError from "http-errors";
import User from "../models/user.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const user = await User.findOne({ email });

      // if user doesn't exist or isn't verified
      if (!(user && user.verified))
        return done(
          new createError.NotAcceptable("Username/Password not valid")
        );

      // compare password with hash
      const isMatch = await user.isValidPassword(password);

      if (!isMatch)
        return done(
          new createError.NotAcceptable("username/password not valid")
        );

      // user logged in
      done(undefined, user);
    }
  )
);
