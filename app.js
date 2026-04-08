// config/app.js
import cors from "cors";
import express from "express";
import passport from "passport";
import "./config/passport.js";
import { sessionMiddleware } from "./config/session.js";
import authRouter from "./routes/authRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import userRouter from "./routes/userRoutes.js";
export const createApp = () => {
  //create express
  const app = express();

  //Midddleware for Global
  app.use(express.json({ limit: "5mb" }));
  app.use(
    cors({
      origin: "http://localhost:5173" || process.env.originURL,
      credentials: true,
    }),
  );

  app.use(sessionMiddleware);

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api/status", (req, res) => res.send("Server is Live"));
  app.use("/api/auth", userRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/messages", messageRouter);

  return app;
};
