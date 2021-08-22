import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "express-async-errors";
import * as userRepository from "../data/auth.js";
import { config } from "../config.js";

export async function signup(req, res) {
  const { username, password, name, email, url } = req.body;
  const found = await userRepository.findByUsername(username);
  if (found) {
    return res.status(409).json({ message: `${username} already exists` });
  }
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const userId = await userRepository.createUser({
    username,
    password: hashed,
    name,
    email,
    url,
  });

  const token = createJwt(userId);
  setToken(res, token); // for browser clients
  res.status(201).json({ token, username }); // for non-browser clients
}

export async function login(req, res) {
  const { username, password } = req.body;
  const user = await userRepository.findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: "invalid user or password" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "invalid user or password" });
  }

  const token = createJwt(user.id);
  setToken(res, token); // for browser clients
  res.status(200).json({ token, username }); // for non-browser clients
}

export async function logout(req, res, next) {
  res.cookie("token", "");
  res.status(200).json({ message: "User has been logged out" });
}

export async function me(req, res) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  res.status(200).json({ token: req.token, username: user.username });
}

function createJwt(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

// Set token in cookie for browser clients
function setToken(res, token) {
  const options = {
    maxAge: config.jwt.expiresInSec * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };
  res.cookie("token", token, options);
}

export async function csrfToken(req, res, next) {
  const csrfToken = await generateCSRFToken();
  res.status(200).json({ csrfToken });
}

async function generateCSRFToken() {
  return bcrypt.hash(congif.csrf.plainToken, 1);
}
