import passport from "passport";
import User from "../models/user.js";

// * adds passport feild on session
export const serializeUser = () => {
  passport.serializeUser((user, done) => {
    done(undefined, user.id);
  });
};

// * extrats userid from session
// * finds user in database
// * attaches user to req.user

export const deserializeUser = () => {
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) return done(undefined, false);
      done(undefined, user);
    } catch (error) {
      done(error);
    }
  });
};
