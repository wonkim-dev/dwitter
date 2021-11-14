import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import "express-async-errors";
import tweetsRouter from "./router/tweets.js";
import authRouter from "./router/auth.js";
import { config } from "./config.js";
import { csrfCheck } from "./middleware/csrf.js";
import rateLimit from "./middleware/rate-limiter.js";

const app = express();

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true, // enable Access-Control-Allow-Credentials
};

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOption));
app.use(morgan("tiny"));
app.use(rateLimit);

app.use(csrfCheck);
app.use("/tweets", tweetsRouter);
app.use("/auth", authRouter);

// Handle requests that have not been captured up to this.
app.use((req, res) => {
  res.sendStatus(404);
});

// Handle errors that have not been captured up to this.
app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

export default app;
