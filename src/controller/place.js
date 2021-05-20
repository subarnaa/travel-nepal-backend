import createError from "http-errors";
import Place from "../models/place.js";
import User from "../models/user.js";
import { removeBucktItem } from "../utils/helpers.js";

/**
 *
 * @desc Fetch all places
 * @route GET /api/places
 * @access private
 */

export const getAllPlaces = async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const places = await Place.find(keyword).select(
    "name image description location type"
  );

  res.send(places);
};

export const getUserPlaces = async (req, res) => {
  const { user } = req;

  const allPlaces = await Place.find().select("name author image description");

  const places = allPlaces.filter(place => {
    return place.author.toString() === user._id.toString()
  }
  )

  if (!places) return res.send([]);

  res.send(places);
}

/**
 *
 * @desc Fetch place by id
 * @route GET /api/places/:id
 * @access private
 */

export const getPlaceById = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const place = await Place.findById(id).populate("author reviews.user guides");
  if (!place) throw createError(404, "Place not found");

  // see if user if guide to this place
  const isGuide = place.guides.find(
    (guide) => guide.id === (user).id.toString()
  );

  // see if user has this place on bucketlist
  const inBucketlist = (user).bucketList.find(
    (placeInBucket) => placeInBucket.place.toString() === place.id
  );

  const placeToSend = {
    ...place.toJSON(),
    userGuide: isGuide ? true : false,
    inBucketList: inBucketlist ? true : false,
  };

  res.send(placeToSend);
};

/**
 *
 * @desc add a place
 * @route POST /api/places
 * @access private
 */

export const addPlace = async (req, res) => {
  const placeInfo = req.body;
  const { user } = req;
  const placeToAdd = { author: (user).id, ...placeInfo };
  const addedPlace = await new Place(placeToAdd).save();
  res.status(200).send(addedPlace);
};

/**
 *
 * @desc get top rated place
 * @route GET /api/place/top
 * @access private
 */

export const getTopPlaces = async (_req, res) => {
  const places = await Place.find({})
    .sort({ rating: -1 })
    .limit(3)
    .select("name image description type rating numReviews");
  res.send(places);
};

/**
 *
 * @desc get editor choice
 * @route GET /api/place/editor
 * @access private
 */

export const getEditorChoices = async (_req, res) => {
  const places = await Place.find({ editorChoice: true })
    .limit(5)
    .select("name image description type rating numReviews");
  res.send(places);
};

/**
 *
 * @desc delete place
 * @route DELETE /api/place/:id
 * @access private
 */

export const deletePlace = async (req, res) => {
  const { id } = req.params;
  const placeToDelete = await Place.findById(id);

  if (!placeToDelete) throw new createError.NotFound("place not found");

  if ((req.user).id.toString() !== placeToDelete.author.toString()) {
    throw new createError.Unauthorized();
  }

  // remove place from bucketlist
  const allUsers = await User.find({});
  allUsers.map(async (user) => {
    await removeBucktItem(user, id);
  });

  await Place.findByIdAndDelete(id);
  res.sendStatus(204);
};

/**
 *
 * @desc edit place
 * @route PUT /api/place/:id
 * @access private
 */

export const editPlace = async (req, res) => {
  const { id } = req.params;
  const placeToEdit = await Place.findById(id);

  if (!placeToEdit) throw new createError.NotFound("place not found");

  if ((req.user).id.toString() !== placeToEdit.author.toString()) {
    throw new createError.Unauthorized();
  }

  placeToEdit.name = req.body.name || placeToEdit.name;
  placeToEdit.description = req.body.description || placeToEdit.description;
  placeToEdit.type = req.body.type || placeToEdit.type;
  placeToEdit.image = req.body.image || placeToEdit.image;
  placeToEdit.location = req.body.location || placeToEdit.location;

  const editedPlace = await placeToEdit.save();

  res.status(200).send(editedPlace);
};
