import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * * Contains Schema of database from User
 */

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      trim: true,
      required: true,
    },
    displayPicture: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      default: null, // null if signin with oauth
    },
    verified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["traveller", "guide"],
      default: "traveller",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    guideInfo: {
      type: Object,
    },
    bucketList: [
      {
        place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Place" },
        status: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  virtuals: true,
  transform: function (_doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.googleId;
    delete ret.password;
  },
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    // could be false if signin from oauth
    if (this.password === null) return false;

    // for some reason TS thinks this.password is a function
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // if password is not present
  // is null for oauth
  if (!this.password) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
