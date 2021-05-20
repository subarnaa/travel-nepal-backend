// import { Request, Response } from "express";
import createError from "http-errors";
import Place from "../models/place.js";

import { removeUserGuides } from "../utils/helpers.js";

export const beGuide = async (req, res) => {
  const { user } = req;
  let guideInfo = req.body;
  guideInfo.verified = false;
  (user).guideInfo = guideInfo;
  (user).role = "guide";
  await (user).save();
  res.status(200).send(user);
};

export const guidePlace = async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  if ((user).role !== "guide")
    throw new createError.Unauthorized(
      "You do not have proper role for this action"
    );

  const place = await Place.findById(id);

  if (!place) throw createError(404, "Place not found");

  const alreadyGuided = place.guides.find(
    (guide) => guide.toString() === (user).id
  );

  if (alreadyGuided)
    throw createError(400, "You are already guide to this place");

  place.guides.push(user);
  await place.save();

  res.sendStatus(201);
};

export const unGuidePlace = async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  if ((user).role !== "guide")
    throw new createError.Unauthorized(
      "You do not have proper role for this action"
    );

  const place = await Place.findById(id);

  if (!place) throw createError(404, "Place not found");

  await removeUserGuides(place, (user).id);

  await place.save();
  res.sendStatus(204);
};
