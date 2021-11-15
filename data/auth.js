import Mongoose from "mongoose";
import { useVirtualId } from "../database/database.js";

const userSchema = new Mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  url: String,
  avatar: { type: Buffer },
});

useVirtualId(userSchema);
export const User = Mongoose.model("User", userSchema);

export async function createUser(user) {
  return new User(user).save().then((data) => data.id);
}

export async function findByUsername(username) {
  return User.findOne({ username });
}

export async function findById(id) {
  return User.findById(id);
}

export async function uploadAvatar(userId, imgBuffer) {
  return User.findByIdAndUpdate(
    userId,
    { avatar: imgBuffer },
    { returnOriginal: false }
  );
}
