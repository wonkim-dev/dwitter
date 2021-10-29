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

describe("test /auth", () => {
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
    describe("Signup with incomplete data", () => {
      test("Should fail to create a user with empty username", async () => {
        await request(app)
          .post("/auth/signup")
          .set("dwitter-csrf-token", userOneCSRFToken)
          .send(Object.assign({}, userOne, { username: null }))
          .expect(400);
      });

      test("Should fail to create a user with empty password", async () => {
        await request(app)
          .post("/auth/signup")
          .set("dwitter-csrf-token", userOneCSRFToken)
          .send(Object.assign({}, userOne, { password: null }))
          .expect(400);
      });

      test("Should fail to create a user with empty name", async () => {
        await request(app)
          .post("/auth/signup")
          .set("dwitter-csrf-token", userOneCSRFToken)
          .send(Object.assign({}, userOne, { name: null }))
          .expect(400);
      });

      test("Should fail to create a user with empty email", async () => {
        await request(app)
          .post("/auth/signup")
          .set("dwitter-csrf-token", userOneCSRFToken)
          .send(Object.assign({}, userOne, { email: null }))
          .expect(400);
      });
    });

    test("Should create a user via browser successfully", async () => {
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
    test("Should fail to get me with wrong JWT token", async () => {
      const response = await request(app)
        .get("/auth/me")
        .set("Cookie", ["token="])
        .send()
        .expect(401);
      expect(response.body).toEqual({ message: "Authentication Error" });
    });

    test("Should get me successfully", async () => {
      await request(app)
        .get("/auth/me")
        .set("Cookie", [`token=${userOneJWTtoken}`])
        .send()
        .expect(200);
    });
  });

  describe("POST /auth/logout", () => {
    test("should logout successfully", async () => {
      const response = await request(app)
        .post("/auth/logout")
        .set("dwitter-csrf-token", userOneCSRFToken)
        .send()
        .expect(200);
      expect(response.body).toEqual({ message: "User has been logged out" });
    });
  });

  describe("POST /auth/login", () => {
    describe("Login with wrong info", () => {
      test("Should fail to login with non-existing username", async () => {
        const response = await request(app)
          .post("/auth/login")
          .set("dwitter-csrf-token", userOneCSRFToken)
          .send({
            username: "wrongUsername",
            password: "alskej2@!",
          })
          .expect(401);
        expect(response.body).toEqual({ message: "invalid user or password" });
      });

      test("Should fail to login with wrong password", async () => {
        const response = await request(app)
          .post("/auth/login")
          .set("dwitter-csrf-token", userOneCSRFToken)
          .send({
            username: "firstUser",
            password: "wrongPassword",
          })
          .expect(401);
        expect(response.body).toEqual({ message: "invalid user or password" });
      });

      test("Should fail to login without CSRF token", async () => {
        const response = await request(app)
          .post("/auth/login")
          .send({
            username: "firstUser",
            password: "alskej2@!",
          })
          .expect(403);
        expect(response.body).toEqual({ message: "Failed CSRF check" });
      });

      test("Should fail to login with invalid CSRF token", async () => {
        const response = await request(app)
          .post("/auth/login")
          .set("dwitter-csrf-token", "wrongCSRFToken")
          .send({
            username: "firstUser",
            password: "alskej2@!",
          })
          .expect(403);
        expect(response.body).toEqual({ message: "Failed CSRF check" });
      });
    });

    test("Should log in successfully", async () => {
      const response = await request(app)
        .post("/auth/login")
        .set("dwitter-csrf-token", userOneCSRFToken)
        .send({
          username: "firstUser",
          password: "alskej2@!",
        })
        .expect(200);
      response.body.username = "firstUser";
    });
  });
});

// Disconnect DB
afterAll(async () => {
  await Mongoose.connection.close();
});
