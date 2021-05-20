export const removeUserReview = async (place, id) => {
  place.reviews = place.reviews.filter(
    (review) => review._id.toString() !== id
  );
  // update num of reviews and rating
  place.numReviews = place.reviews.length;

  // because reduce returns NaN if array is empty
  if (place.numReviews === 0) {
    place.rating = 0;
  } else {
    place.rating =
      place.reviews.reduce((acc, item) => item.rating + acc, 0) /
      place.reviews.length;
  }

  await place.save();
};

export const removeUserGuides = async (place, id) => {
  place.guides = place.guides.filter((guide) => guide.toString() !== id);
  await place.save();
};

export const removeBucktItem = async (user, id) => {
  (user).bucketList = (user).bucketList.filter(
    (placeInBucket) => placeInBucket.place.toString() !== id.toString()
  );
  await (user).save();
};
