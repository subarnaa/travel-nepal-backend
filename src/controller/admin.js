import User from "../models/user.js";
import Place from "../models/place.js";

import {
  removeUserReview,
  removeUserGuides,
  removeBucktItem,
} from "../utils/helpers.js";

export const getAllUser = async (_req, res) => {
  const allUsers = await User.find({});
  res.status(200).send(allUsers);
};

export const getVerifiedGuides = async (_req, res) => {
  const allUsers = await User.find({});

  const pendingGuides = allUsers.filter(user => user.role === "guide" && user.guideInfo && user.guideInfo.verified)

  res.status(200).send(pendingGuides);
};

export const getPendingGuides = async (_req, res) => {
  const allUsers = await User.find({});

  const pendingGuides = allUsers.filter(user => user.role === "guide" && user.guideInfo && user.guideInfo.verified === false)

  res.status(200).send(pendingGuides);
};

export const getAllPlace = async (_req, res) => {
  const allPlace = await Place.find({});
  res.status(200).send(allPlace);
};

export const deletePlace = async (req, res) => {
  const { id } = req.params;

  // delete place
  await Place.findByIdAndDelete(id);

  // delete from bucketlist
  const allUsers = await User.find({});
  allUsers.map(async (user) => {
    await removeBucktItem(user, id);
  });
  res.sendStatus(204);
};

export const updatePlace = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  await Place.findByIdAndUpdate(id, updatedData);
  res.sendStatus(200);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  // delete user
  await User.findByIdAndDelete(id);

  // remove place added by user from bucketlist
  const placeByUser = await Place.findOne({ author: id });
  const allUsers = await User.find({});
  allUsers.map(async (user) => {
    await removeBucktItem(user, placeByUser.id);
  });

  // delete user contribution
  await Place.findOneAndDelete({ author: id });

  // remove user reviews
  const allPlaces= await Place.find({});
  allPlaces.map(async (place) => {
    await removeUserReview(place, id);
  });

  // remove user as guide
  allPlaces.map(async (place) => {
    await removeUserGuides(place, id);
  });

  res.sendStatus(204);
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { newData, oldData } = req.body;
  let updatedData;

  // traveller => guide
  if (oldData.role === "traveller" && newData.role === "guide") {
    newData.guideInfo = { description: "" };
    updatedData = newData;
  }

  // guide => traveller
  if (oldData.role === "guide" && newData.role === "traveller") {
    const { guideInfo, ...rest } = newData;
    updatedData = rest;

    // remove guide from places
    const allPlaces = await Place.find({});
    allPlaces.map(async (place) => {
      await removeUserGuides(place, id);
    });
  }

  // rest is same
  updatedData = newData;

  await User.findByIdAndUpdate(id, updatedData);
  res.sendStatus(200);
};
