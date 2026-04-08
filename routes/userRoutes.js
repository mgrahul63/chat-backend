import express from "express";
import passport from "passport";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

userRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

userRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect(process.env.originURL || "http://localhost:5173");
  },
);

userRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

userRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect(process.env.originURL || "http://localhost:5173");
  },
);

userRouter.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] }),
);

userRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect(process.env.originURL || "http://localhost:5173");
  },
);

userRouter.post("/update-profile", protectRoute, updateProfile);
userRouter.post("/check", protectRoute, checkAuth);

export default userRouter;
