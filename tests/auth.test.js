import request from "supertest";
import { app } from "../app-test.js";
import * as userRepository from "../data/auth.js";

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
beforeEach(async () => {
  await userRepository.User.deleteMany();
});

test("Should get CSRF Token", async () => {
  const response = await request(app)
    .get("/auth/csrf-token")
    .send()
    .expect(200);
  expect(response.body.csrfToken).not.toBeFalsy();
  userOneCSRFToken = response.body.csrfToken;
});

test("Should create a user via browser", async () => {
  const response = await request(app)
    .post("/auth/signup")
    .set("dwitter-csrf-token", userOneCSRFToken)
    .send(userOne)
    .expect(201);
  expect(response.body.token).not.toBeFalsy();
  expect(response.body.username).toBe("firstUser");
  userOneUsername = response.body.username;
  userOneJWTtoken = response.body.token;
});
