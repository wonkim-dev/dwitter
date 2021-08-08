import MongoDb from "mongodb";
import { config } from "../config.js";

let db;

export async function connectDB() {
  const client = await MongoDb.MongoClient.connect(config.db.host, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = client.db();
  return client;
}

export function getUsers() {
  return db.collection("users");
}

export function getTweets() {
  return db.collection("tweets");
}
