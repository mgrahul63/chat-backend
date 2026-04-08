import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/user-model.js";
import ObjectById from "../utils/ObjectById.js";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({
          $or: [
            { provider: "google", providerId: profile.id },
            { email: profile.emails?.[0]?.value },
          ],
        }).lean();

        if (!user) {
          user = await UserModel.create({
            provider: "google",
            providerId: profile.id,
            providerEmail: profile.emails?.[0]?.value || "",
            providerName: profile.displayName || "",
            providerAvatar: profile.photos?.[0]?.value || "",

            // optional (good practice)
            email: profile.emails?.[0]?.value || "",
            name: profile.displayName || "",
          });
        }
        done(null, ObjectById(user));
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value || `${profile.username}@github.com`;

        let user = await UserModel.findOne({
          $or: [
            { provider: "github", providerId: profile.id },
            { email: email },
          ],
        }).lean();

        if (!user) {
          user = await UserModel.create({
            provider: "github",
            providerId: profile.id,
            providerEmail: email,
            providerName: profile.displayName || profile.username,
            providerAvatar: profile.photos?.[0]?.value || "",

            // optional (good practice)
            email: email,
            name: profile.displayName || profile.username,
          });
        }

        done(null, ObjectById(user));
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value || `${profile.id}@facebook.com`;

        let user = await UserModel.findOne({
          $or: [
            { provider: "facebook", providerId: profile.id },
            { email: email },
          ],
        }).lean();

        if (!user) {
          user = await UserModel.create({
            provider: "facebook",
            providerId: profile.id,
            providerEmail: email,
            providerName: profile.displayName || "",
            providerAvatar: profile.photos?.[0]?.value || "",

            // optional (good practice)
            email: email,
            name: profile.displayName || "",
          });
        }

        done(null, ObjectById(user));
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

export default passport;
