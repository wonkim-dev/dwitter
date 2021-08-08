import MongoDb from "mongodb";
import { getTweets } from "../database/database.js";
import * as userRepository from "./auth.js";

const ObjectID = MongoDb.ObjectID;

export async function getAll() {
  return getTweets().find().sort({ created_at: -1 }).toArray().then(mapTweets);
}

export async function getAllByUsername(username) {
  return getTweets()
    .find({ username })
    .sort({ created_at: -1 })
    .toArray()
    .then(mapTweets);
}

export async function getById(id) {
  return getTweets()
    .find({ _id: new ObjectID(id) })
    .next()
    .then(mapOptionalTweet);
}

export async function create(text, userId) {
  return userRepository
    .findById(userId)
    .then((user) => {
      return getTweets().insertOne({
        text,
        created_at: Date(),
        user_id: userId,
        name: user.name,
        username: user.username,
        url: user.url,
      });
    })
    .then((result) => result.ops[0])
    .then(mapOptionalTweet);
}

export async function update(id, text) {
  return getTweets()
    .findOneAndUpdate(
      { _id: new ObjectID(id) },
      { $set: { text } },
      { returnDocument: "after" }
    )
    .then((result) => result.value)
    .then(mapOptionalTweet);
}

export async function remove(id) {
  return getTweets().deleteOne({ _id: new ObjectID(id) });
}

function mapTweets(tweets) {
  return tweets.map((t) => {
    return { ...t, id: t._id.toString() };
  });
}

function mapOptionalTweet(tweet) {
  return tweet ? { ...tweet, id: tweet._id.toString() } : tweet;
}
