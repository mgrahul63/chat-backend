// config/session.js
import MongoStore from "connect-mongo";
import session from "express-session";

export const sessionMiddleware = session({
  secret: "mg",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: "sessions",
    ttl: 1000 * 60 * 10,
  }),
  cookie: {
    maxAge: 1000 * 60 * 10,
    httpOnly: true,
    secure: false,
  },
  rolling: true,
});
