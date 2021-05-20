import createError from "http-errors";
import Place from "../models/place.js";
import { removeBucktItem } from "../utils/helpers.js";

/**
 *
 * @desc Fetch all places from bucketlist
 * @route GET /api/buckets
 * @access private
 */
export const getAllBucketList = async (req, res) => {
  const { user } = req;
  const places = await (user)
    .populate("bucketList.place")
    .execPopulate();
  res.status(200).send(places.bucketList);
};

/**
 *
 * @desc add place to bucketlist
 * @route POST /api/buckets/:id
 * @access private
 */
export const addToBucketlist = async (req, res) => {
  const { user } = req;
  const { id } = req.params;

  const place = await Place.findById(id);

  if (!place) throw createError(404, "Place not found");

  const alreadyAdded = (user).bucketList.find(
    (placeInBucket) => placeInBucket.place.toString() === place.id
  );

  if (alreadyAdded)
    throw createError(400, "This place is already added to the bucketlists");

  (user).bucketList.push({ place });
  await (user).save();

  res.sendStatus(201);
};

/**
 *
 * @desc delete place from bucketlist
 * @route DELETE /api/places/:id
 * @access private
 */
export const removeFromBucketlist = async (req, res) => {
  const { user } = req;
  const { id } = req.params;

  const place = await Place.findById(id);

  if (!place) throw createError(404, "Place not found");

  await removeBucktItem(user, place.id);

  res.sendStatus(204);
};

/**
 *
 * @desc mark place as complete
 * @route PUT /api/places/:id
 * @access private
 */
export const updateBucketListItem = async (req, res) => {
  const { user } = req;
  const { status } = req.body;
  const { id } = req.params;

  const place = await Place.findById(id);

  if (!place) throw createError(404, "Place not found");

  (user).bucketList = (user).bucketList.map(
    (placeInBucket) =>
      placeInBucket.place.toString() === place.id.toString()
        ? { place: place.id, status }
        : placeInBucket
  );

  await (user).save();
  res.sendStatus(200);
};
