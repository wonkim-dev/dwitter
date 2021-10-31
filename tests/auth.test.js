import request from "supertest";
import Mongoose from "mongoose";
import { app } from "../app.js";
import { connectDB } from "../database/database.js";
import {
  initializeDBForAuthTest,
  CSRFToken,
  userOne,
  userOneToken,
} from "./fixtures/db.js";

// Connect to testDB
connectDB(true);

const dummyUser = {
  username: "dummyUser",
  password: "passwordDummy",
  name: "Dummy User",
  email: "dummyuser@email.com",
  url: "",
};

// Initialize users collection before each test
beforeEach(async () => {
  await initializeDBForAuthTest();
});

describe("GET /auth/csrf-token", () => {
  test("Should get CSRF Token", async () => {
    const response = await request(app)
      .get("/auth/csrf-token")
      .send()
      .expect(200);
    expect(response.body.csrfToken).toBeTruthy();
  });
});

describe("GET /auth/me", () => {
  describe("Request with correct credentials", () => {
    test("Should get me successfully (browser clients)", async () => {
      const response = await request(app)
        .get("/auth/me")
        .set("Cookie", [`token=${userOneToken}`])
        .send()
        .expect(200);
      expect(response.body).toEqual({
        token: userOneToken,
        username: userOne.username,
      });
    });

    test("Should get me successfully (non-browser clients)", async () => {
      const response = await request(app)
        .get("/auth/me")
        .set("Authorization", `Bearer ${userOneToken}`)
        .send()
        .expect(200);
      expect(response.body).toEqual({
        token: userOneToken,
        username: userOne.username,
      });
    });
  });

  describe("Request with invalid credentials", () => {
    test("Should fail to get me with invalid JWT token (browser clients)", async () => {
      const response = await request(app)
        .get("/auth/me")
        .set("Cookie", ["token=invalidToken"])
        .send()
        .expect(401);
      expect(response.body).toEqual({ message: "Authentication Error" });
    });

    test("Should fail to get me with invalid JWT token (non-browser clients)", async () => {
      const response = await request(app)
        .get("/auth/me")
        .set("Authorization", "Bearer invalidToken")
        .send()
        .expect(401);
      expect(response.body).toEqual({ message: "Authentication Error" });
    });

    test("Should fail to get me with missing token field in request header", async () => {
      const response = await request(app).get("/auth/me").send().expect(401);
      expect(response.body).toEqual({ message: "Authentication Error" });
    });
  });
});

describe("POST /auth/signup", () => {
  describe("Signup with correct data", () => {
    test("Should create a user successfully", async () => {
      const response = await request(app)
        .post("/auth/signup")
        .set("dwitter-csrf-token", CSRFToken)
        .send(dummyUser)
        .expect(201);
      expect(response.body.token).toBeTruthy();
      expect(response.body.username).toBe(dummyUser.username);
    });
  });

  describe("Signup with incomplete data", () => {
    test("Should fail to create a user with empty username", async () => {
      const response = await request(app)
        .post("/auth/signup")
        .set("dwitter-csrf-token", CSRFToken)
        .send(Object.assign({}, dummyUser, { username: null }))
        .expect(400);
      expect(response.body).toEqual({
        message: "username should be between 6 and 15 characters",
      });
    });

    test("Should fail to create a user with empty password", async () => {
      const response = await request(app)
        .post("/auth/signup")
        .set("dwitter-csrf-token", CSRFToken)
        .send(Object.assign({}, dummyUser, { password: null }))
        .expect(400);
      expect(response.body).toEqual({
        message: "password should be at least 5 characters",
      });
    });

    test("Should fail to create a user with empty name", async () => {
      const response = await request(app)
        .post("/auth/signup")
        .set("dwitter-csrf-token", CSRFToken)
        .send(Object.assign({}, dummyUser, { name: null }))
        .expect(400);
      expect(response.body).toEqual({
        message: "name is missing",
      });
    });

    test("Should fail to create a user with empty email", async () => {
      const response = await request(app)
        .post("/auth/signup")
        .set("dwitter-csrf-token", CSRFToken)
        .send(Object.assign({}, dummyUser, { email: null }))
        .expect(400);
      expect(response.body).toEqual({
        message: "invalid email",
      });
    });

    test("Should fail to create a user with existing username", async () => {
      const response = await request(app)
        .post("/auth/signup")
        .set("dwitter-csrf-token", CSRFToken)
        .send(Object.assign({}, dummyUser, { username: userOne.username }))
        .expect(409);
      expect(response.body).toEqual({
        message: `${userOne.username} already exists`,
      });
    });
  });
});

describe("POST /auth/login", () => {
  describe("Login with correct credentials", () => {
    test("Should log in successfully", async () => {
      const response = await request(app)
        .post("/auth/login")
        .set("dwitter-csrf-token", CSRFToken)
        .send({
          username: userOne.username,
          password: userOne.password,
        })
        .expect(200);
      expect(response.body.username).toBe(userOne.username);
    });
  });

  describe("Login with invalid credentials", () => {
    test("Should fail to login with non-existing username", async () => {
      const response = await request(app)
        .post("/auth/login")
        .set("dwitter-csrf-token", CSRFToken)
        .send({
          username: "wrongUsername",
          password: userOne.password,
        })
        .expect(401);
      expect(response.body).toEqual({ message: "invalid user or password" });
    });

    test("Should fail to login with wrong password", async () => {
      const response = await request(app)
        .post("/auth/login")
        .set("dwitter-csrf-token", CSRFToken)
        .send({
          username: userOne.username,
          password: "wrongPassword",
        })
        .expect(401);
      expect(response.body).toEqual({ message: "invalid user or password" });
    });

    test("Should fail to login without dwitter-csrf-token field in request header", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          username: userOne.username,
          password: userOne.password,
        })
        .expect(403);
      expect(response.body).toEqual({ message: "Failed CSRF check" });
    });

    test("Should fail to login with invalid CSRF token", async () => {
      const response = await request(app)
        .post("/auth/login")
        .set("dwitter-csrf-token", "wrongCSRFToken")
        .send({
          username: userOne.username,
          password: userOne.password,
        })
        .expect(403);
      expect(response.body).toEqual({ message: "Failed CSRF check" });
    });
  });
});

describe("POST /auth/logout", () => {
  test("should logout successfully", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .set("dwitter-csrf-token", CSRFToken)
      .send()
      .expect(200);
    expect(response.body).toEqual({ message: "User has been logged out" });
  });

  test("should fail to logout without dwitter-csrf-token field in request header", async () => {
    const response = await request(app).post("/auth/logout").send().expect(403);
    expect(response.body).toEqual({ message: "Failed CSRF check" });
  });

  test("should fail to logout with invalid CSRF token", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .set("dwitter-csrf-token", "wrongCSRFToken")
      .send()
      .expect(403);
    expect(response.body).toEqual({ message: "Failed CSRF check" });
  });
});

// Disconnect DB
afterAll(async () => {
  Mongoose.connection.close();
});
