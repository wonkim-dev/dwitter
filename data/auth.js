import MongoDb from "mongodb";
import { getUsers } from "../database/database.js";

const ObjectID = MongoDb.ObjectID;

export async function createUser(user) {
  return getUsers()
    .insertOne(user)
    .then((result) => result.ops[0]._id.toString());
}

export async function findByUsername(username) {
  return getUsers().find({ username }).next().then(mapOptionalUser);
}

export async function findById(id) {
  return getUsers()
    .find({ _id: new ObjectID(id) })
    .next()
    .then(mapOptionalUser);
}

function mapOptionalUser(user) {
  return user ? { ...user, id: user._id.toString() } : user;
}
