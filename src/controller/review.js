// import { Request, Response } from "express";
import Place from "../models/place.js";
import createError from "http-errors";

import { removeUserReview } from "../utils/helpers.js";

/**
 *
 * @desc add a review
 * @route POST /api/places/:id/reviews
 * @access private
 */

export const createReview = async (req, res) => {
  const { rating, comment, img, title } = req.body;
  const { id } = req.params;
  const { user } = req;

  const place = await Place.findById(id);

  if (!place) throw createError(404, "Place not found");

  // const alreadyReviewed = place.reviews.find(
  //   (review) => review.user.toString() === (user).id
  // );

  // if (alreadyReviewed) throw createError(400, "Place already reviewed");

  const review = {
    comment,
    user: (user).id,
    rating,
    img,
    title,
  };

  place.reviews.push(review);
  place.numReviews = place.reviews.length;

  place.rating =
    place.reviews.reduce((acc, item) => item.rating + acc, 0) /
    place.reviews.length;

  await place.save();

  res.status(201).send(place);
};

/**
 *
 * @desc delete a review
 * @route DELETE /api/places/:id/reviews
 * @access private
 */

export const deleteReview = async (req, res) => {
  const { id, placeId } = req.body;
  console.log(req.body)
  const place = await Place.findById(placeId);

  if (!place) throw new createError.NotFound("Place Not Found");

  const review = place.reviews.find(
    (review) => {
      console.log(review._id)
      return review._id.toString() === id}
  );
  console.log(review)

  if (!review) throw new createError.NotFound("review not found");

  await removeUserReview(place, id);

  res.sendStatus(204);
};

/**
 *
 * @desc edit a review
 * @route PUT /api/places/:id/reviews
 * @access private
 */

export const editReview = async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);

  if (!place) throw new createError.NotFound("place not found");

  const reviewToEdit = place.reviews.find(
    (review) => review.user.toString() === (req.user).id
  );

  if (!reviewToEdit) throw new createError.NotFound("review not found");

  reviewToEdit.comment = req.body.comment || reviewToEdit.comment;
  reviewToEdit.title = req.body.title || reviewToEdit.title;
  reviewToEdit.img = req.body.img || reviewToEdit.img;

  // if rating is zero above test will always be false
  if (req.body.rating >= 0) {
    reviewToEdit.rating = req.body.rating;
  }

  place.reviews = place.reviews.map((review) =>
    review.id.toString() === reviewToEdit.id.toString() ? reviewToEdit : review
  );

  // update num of reviews and rating
  place.numReviews = place.reviews.length;

  place.rating =
    place.reviews.reduce((acc, item) => item.rating + acc, 0) /
    place.reviews.length;

  await place.save();
  res.sendStatus(201);
};


