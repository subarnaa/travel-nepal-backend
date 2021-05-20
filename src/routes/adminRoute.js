import express from "express";
import { celebrate } from "celebrate";
import {
  getAllUser,
  deleteUser,
  updateUser,
  getAllPlace,
  deletePlace,
  updatePlace,
  getPendingGuides,
  getVerifiedGuides,
} from "../controller/admin.js";
import { adminOnly, denyGuest } from "../utils/authorization.js";
import { adminEditPlacesValidator } from "../utils/validator.js";

const router = express.Router();

router.route("/users").get(denyGuest, adminOnly, getAllUser);

router.route("/users/guides/verified").get(denyGuest, adminOnly, getVerifiedGuides);

router.route("/users/guides/pending").get(denyGuest, adminOnly, getPendingGuides);

router
  .route("/users/guides/:id")
  .put(denyGuest, adminOnly, updateUser)

router
  .route("/users/:id")
  .put(denyGuest, adminOnly, updateUser)
  .delete(denyGuest, adminOnly, deleteUser);

router.route("/places").get(denyGuest, adminOnly, getAllPlace);

router
  .route("/places/:id")
  .put(denyGuest, adminOnly, celebrate(adminEditPlacesValidator), updatePlace)
  .delete(denyGuest, adminOnly, deletePlace);

export default router;
