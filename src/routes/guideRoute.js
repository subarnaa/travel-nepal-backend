import express from "express";
import { celebrate } from "celebrate";
import { beGuide, guidePlace, unGuidePlace } from "../controller/guide.js";
import { denyGuest } from "../utils/authorization.js";
import { beGuideValidator } from "../utils/validator.js";

const router = express.Router();

router.route("/").post(denyGuest, celebrate(beGuideValidator), beGuide);

router
  .route("/:id")
  .post(denyGuest, guidePlace)
  .delete(denyGuest, unGuidePlace);

export default router;
