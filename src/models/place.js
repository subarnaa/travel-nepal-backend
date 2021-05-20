import mongoose from "mongoose";

 // * * Contains database Schema of Place

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
      max: 5,
      min: 0,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    img: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const placeSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: [
      {
        type: Number,
        required: true,
      },
    ],
    type: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    rating: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    editorChoice: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const cleanDatabaseFields = (schemaName) => {
  /*
   * replaces _id with id
   * deletes __v before sending
   */
  schemaName.set("toJSON", {
    virtuals: true,
    transform: (_document, returnedObject) => {
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });
};

cleanDatabaseFields(placeSchema);
cleanDatabaseFields(reviewSchema);

const Place = mongoose.model("Place", placeSchema);

export default Place;
