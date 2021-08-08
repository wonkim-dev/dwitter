import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import "express-async-errors";
import tweetsRouter from "./router/tweets.js";
import authRouter from "./router/auth.js";
import { config } from "./config.js";
import { connectDB } from "./database/database.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
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
  .then((client) => {
    console.log(`connected to ${client.s.options.dbName} database`);
    app.listen(config.host.port);
  })
  .catch(console.error);
