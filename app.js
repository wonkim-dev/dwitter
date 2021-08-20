import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import "express-async-errors";
import tweetsRouter from "./router/tweets.js";
import authRouter from "./router/auth.js";
import { config } from "./config.js";
import { connectDB } from "./database/database.js";

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

app.use("/tweets", tweetsRouter);
app.use("/auth", authRouter);

app.use((req, res) => {
  res.sendStatus(404);
});

app.use((error, req, res) => {
  console.error(error);
  res.sendStatus(500);
});

connectDB()
  .then(() => {
    app.listen(config.host.port, () => {
      console.log("Server is up on port" + config.host.port);
    });
  })
  .catch(console.error);
