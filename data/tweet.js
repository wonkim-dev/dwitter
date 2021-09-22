import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";
import * as userRepository from "./auth.js";

const tweetSchema = Mongoose.Schema(
  {
    text: { type: String, required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    comments: [
      {
        text: { type: String, require: true },
        userId: { type: String, require: true },
        username: { type: String, require: true },
        url: String,
        createdAt: Date,
      },
    ],
    url: String,
  },
  { timestamps: true }
);

useVirtualId(tweetSchema);
const Tweet = Mongoose.model("Tweet", tweetSchema);

export async function getAll() {
  return Tweet.find().sort({ createdAt: -1 }).limit(20);
}

export async function getAllByUsername(username) {
  return Tweet.find({ username }).sort({ createdAt: -1 }).limit(20);
}

export async function getById(id) {
  return Tweet.findById(id);
}

export async function create(text, userId) {
  return userRepository.findById(userId).then((user) => {
    return new Tweet({
      text,
      userId,
      name: user.name,
      username: user.username,
      url: user.url,
    }).save();
  });
}

export async function update(id, text) {
  return Tweet.findByIdAndUpdate(id, { text }, { returnOriginal: false });
}

export async function remove(id) {
  return Tweet.findByIdAndDelete(id);
}

export async function addComment(userId, tweetId, text) {
  return userRepository.findById(userId).then((user) => {
    return Tweet.findByIdAndUpdate(
      tweetId,
      {
        $push: {
          comments: {
            text,
            userId,
            username: user.username,
            url: user.url,
            createdAt: new Date(),
          },
        },
      },
      { returnOriginal: false }
    );
  });
}

export async function updateCommentById(id, commentId, text) {
  return Tweet.findOneAndUpdate(
    {
      _id: Mongoose.Types.ObjectId(id),
      "comments._id": Mongoose.Types.ObjectId(commentId),
    },
    {
      $set: {
        "comments.$.text": text,
      },
    },
    { returnOriginal: false }
  );
}

export async function deleteCommentById(id, commentId) {
  return Tweet.findOneAndUpdate(
    {
      _id: Mongoose.Types.ObjectId(id),
    },
    {
      $pull: {
        comments: {
          _id: Mongoose.Types.ObjectId(commentId),
        },
      },
    },
    { returnOriginal: false }
  );
}
