import request from "supertest";
import Mongoose from "mongoose";
import { app } from "../app.js";
import * as userRepository from "../data/auth.js";
import { connectDB } from "../database/database.js";

await connectDB(true);

const userOne = {
  username: "firstUser",
  password: "alskej2@!",
  name: "First User",
  email: "firstuser@email.com",
  url: "https://images.pexels.com/photos/668435/pexels-photo-668435.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
};
let userOneCSRFToken;
let userOneJWTtoken;

// Empty the users collection before testing
beforeAll(async () => {
  await userRepository.User.deleteMany();
});

describe("GET /auth/csrf-token", () => {
  test("Should get CSRF Token", async () => {
    const response = await request(app)
      .get("/auth/csrf-token")
      .send()
      .expect(200);
    expect(response.body.csrfToken).not.toBeFalsy();
    userOneCSRFToken = response.body.csrfToken;
  });
});

describe("POST /auth/signup", () => {
  test("Should create a user via browser", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .set("dwitter-csrf-token", userOneCSRFToken)
      .send(userOne)
      .expect(201);
    expect(response.body.token).not.toBeFalsy();
    expect(response.body.username).toBe("firstUser");
    userOneJWTtoken = response.body.token;
  });

  test("Should fail to create a user with existing username", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .set("dwitter-csrf-token", userOneCSRFToken)
      .send(userOne)
      .expect(409);
    expect(response.body.message).toBe(`${userOne.username} already exists`);
  });
});

describe("GET /auth/me", () => {
  test("Should get me", async () => {
    await request(app)
      .get("/auth/me")
      .set("Cookie", [`token=${userOneJWTtoken}`])
      .send()
      .expect(200);
  });
});

// Disconnect DB
afterAll(async () => {
  await Mongoose.connection.close();
});
