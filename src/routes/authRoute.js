import express from "express";
import passport from "passport";
import { celebrate } from "celebrate";

import { logOutRoute } from "../controller/auth/logout.js";
import { signupRoute } from "../controller/auth/signup.js";
import { confirmSignup } from "../controller/auth/confirmSignup.js";
import { confirmPassReset } from "../controller/auth/confirmPassReset.js";
import { reqPassReset } from "../controller/auth/reqPassReset.js";

import { loginFormValidator, signupFormValidator } from "../utils/validator.js";
import { denyLoggedIn, denyGuest } from "../utils/authorization.js";
import { validateHuman } from "../utils/validateHuman.js";

const router = express.Router();

// google oauth route
router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// google oauth callback
router
  .route("/google/callback")
  .get(
    passport.authenticate("google", { failureRedirect: "/login" }),
    (_req, res) => {
      res.redirect("http://localhost:3000/");
    }
  );

// local auth
router
  .route("/login")
  .post(
    denyLoggedIn,
    celebrate(loginFormValidator),
    // validateHuman,
    passport.authenticate("local"),
    (req, res) => {
      res.status(200).send(req.user);
    }
  );

// signup routes
router
  .route("/signup")
  .post(
    denyLoggedIn,
    celebrate(signupFormValidator),
    // validateHuman,
    signupRoute
  );

// confirmation routes
router.route("/email/confirm/:id").get(denyLoggedIn, confirmSignup);

router.route("/password/recover/request").post(denyLoggedIn, reqPassReset);

router
  .route("/password/recover/confirm/:id")
  .post(denyLoggedIn, confirmPassReset);

// logout route
router.route("/logout").post(denyGuest, logOutRoute);

export default router;
