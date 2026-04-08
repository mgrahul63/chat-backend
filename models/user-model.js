import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    // -----------------------------------------
    // LOCAL AUTH FIELDS (email/password signup)
    // -----------------------------------------
    name: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, // Important because provider users may not have email
      default: "",
    },

    password: {
      type: String,
      default: "", // empty when logging in via Google/Facebook
    },

    // -----------------------------------------
    // SOCIAL LOGIN FIELDS
    // -----------------------------------------

    provider: {
      type: String,
      enum: ["local", "google", "facebook", "github"],
      default: "local",
    },

    providerId: {
      type: String, // Google user id, Facebook id, etc.
      default: "",
    },

    providerEmail: {
      type: String, // email returned by provider (if exists)
      trim: true,
      default: "",
    },

    providerName: {
      type: String,
      trim: true,
      default: "",
    },

    providerAvatar: {
      type: String, // original avatar from provider
      trim: true,
      default: "",
    },

    // -----------------------------------------
    // USER CUSTOM FIELDS (user can modify later)
    // -----------------------------------------

    image: {
      type: String, // user uploaded Cloudinary image
      trim: true,
      default: "",
    },

    coverImage: {
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },

    username: {
      type: String,
      sparse: true,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      default: "Hey there! I'm using this app.",
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.models.users || mongoose.model("users", userSchema);

export default UserModel;
