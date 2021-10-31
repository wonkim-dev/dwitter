import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userRepository from "../../data/auth";
import { config } from "../../config.js";

export const CSRFToken = await bcrypt.hash(config.csrf.plainToken, 1);

export const userOne = {
  username: "firstUser",
  password: "passwordFirst",
  name: "First User",
  email: "firstuser@email.com",
  url: "https://images.pexels.com/photos/668435/pexels-photo-668435.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
};
export let userOneId;
export let userOneToken;

function createJwt(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

async function createUser(user) {
  const hashed = await bcrypt.hash(user.password, config.bcrypt.saltRounds);
  const userId = await userRepository.createUser(
    Object.assign({}, user, { password: hashed })
  );
  const token = createJwt(userId);
  return [userId, token];
}

export async function initializeDBForAuthTest() {
  await userRepository.User.deleteMany();
  [userOneId, userOneToken] = await createUser(userOne);
}
