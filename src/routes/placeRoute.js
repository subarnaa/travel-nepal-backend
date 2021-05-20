import express from "express";
import { celebrate } from "celebrate";
import {
  getAllPlaces,
  addPlace,
  getPlaceById,
  getTopPlaces,
  getEditorChoices,
  deletePlace,
  editPlace,
  getUserPlaces,
} from "../controller/place.js";
import { createReview, deleteReview, editReview } from "../controller/review.js";
import { denyGuest } from "../utils/authorization.js";
import {
  addPlacesValidator,
  createReviewValidator,
  editPlaceValidator,
  editReviewValidator,
} from "../utils/validator.js";

const router = express.Router();

router
  .route("/")
  .get(denyGuest, getAllPlaces)
  .post(denyGuest, celebrate(addPlacesValidator), addPlace);

router.route("/top").get(denyGuest, getTopPlaces);

router.route("/editor").get(denyGuest, getEditorChoices);

router
  .route("/:id")
  .get(denyGuest, getPlaceById)
  .delete(deletePlace)
  .put(denyGuest, celebrate(editPlaceValidator), editPlace);

router
  .route("/:id/reviews")
  .post(denyGuest, celebrate(createReviewValidator), createReview)
  .delete(denyGuest, deleteReview)
  .put(denyGuest, celebrate(editReviewValidator), editReview);

router
  .route("/userPlaces")
  .post(denyGuest, getUserPlaces)

export default router;
