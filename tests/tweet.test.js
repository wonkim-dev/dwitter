import request from "supertest";
import Mongoose from "mongoose";
import { app } from "../app.js";
import { connectDB } from "../database/database.js";
import {
  initializeDBForTweetTest,
  CSRFToken,
  userOne,
  userOneToken,
  tweetOne,
  userTwo,
  userTwoToken,
  userOneId,
} from "./fixtures/db.js";

// Connect to testDB
connectDB(true);

// Initialize users collection before each test
beforeEach(async () => {
  await initializeDBForTweetTest();
});

describe("GET /tweets", () => {
  describe("Request with valid credentials", () => {
    test("Should get the recent 20 tweets successfully (browser clients)", async () => {
      const response = await request(app)
        .get("/tweets")
        .set("Cookie", [`token=${userOneToken}`])
        .send()
        .expect(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty("text");
      expect(response.body[0]).toHaveProperty("username");
    });

    test("Should get the recent 20 tweets successfully (non-browser clients)", async () => {
      const response = await request(app)
        .get("/tweets")
        .set("Authorization", `Bearer ${userOneToken}`)
        .send()
        .expect(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty("text");
      expect(response.body[0]).toHaveProperty("username");
    });
  });

  describe("Request with invalid credentials", () => {
    test("Should fail to get the recent 20 tweets with invalid JWT token (browser clients)", async () => {
      const response = await request(app)
        .get("/tweets")
        .set("Cookie", ["token=invalidToken"])
        .send()
        .expect(401);
      expect(response.body).toEqual({ message: "Authentication Error" });
    });

    test("Should fail to get the recent 20 tweets with invalid JWT token (non-browser clients)", async () => {
      const response = await request(app)
        .get("/tweets")
        .set("Authorization", "Bearer invalidToken")
        .send()
        .expect(401);
      expect(response.body).toEqual({ message: "Authentication Error" });
    });
  });
});

describe("POST /tweets", () => {
  describe("Request with valid credentials", () => {
    test("Should create a new tweet successfully (browser clients)", async () => {
      const response = await request(app)
        .post("/tweets")
        .set("dwitter-csrf-token", CSRFToken)
        .set("Cookie", [`token=${userOneToken}`])
        .send({ text: "New tweet!" })
        .expect(201);
      expect(response.body).toHaveProperty("username", userOne.username);
      expect(response.body).toHaveProperty("text", "New tweet!");
    });

    test("Should create a new tweet successfully (non-browser clients)", async () => {
      const response = await request(app)
        .post("/tweets")
        .set("dwitter-csrf-token", CSRFToken)
        .set("Authorization", `Bearer ${userOneToken}`)
        .send({ text: "New tweet!" })
        .expect(201);
      expect(response.body).toHaveProperty("username", userOne.username);
      expect(response.body).toHaveProperty("text", "New tweet!");
    });
  });

  describe("Request with invalid credentials", () => {
    test("Should fail to create a new tweet with invalid JWT token (browser clients)", async () => {
      const response = await request(app)
        .post("/tweets")
        .set("dwitter-csrf-token", CSRFToken)
        .set("Cookie", ["token=invalidToken"])
        .send({ text: "New tweet!" })
        .expect(401);
      expect(response.body).toEqual({ message: "Authentication Error" });
    });

    test("Should fail to create a new tweet with invalid JWT token (non-browser clients)", async () => {
      const response = await request(app)
        .post("/tweets")
        .set("dwitter-csrf-token", CSRFToken)
        .set("Authorization", "Bearer invalidToken")
        .send({ text: "New tweet!" })
        .expect(401);
      expect(response.body).toEqual({ message: "Authentication Error" });
    });

    test("Should fail to create a new tweet with invalid CSRF token (browser clients)", async () => {
      const response = await request(app)
        .post("/tweets")
        .set("dwitter-csrf-token", "wrongCSRFToken")
        .set("Cookie", [`token=${userOneToken}`])
        .send({ text: "New tweet!" })
        .expect(403);
      expect(response.body).toEqual({ message: "Failed CSRF check" });
    });

    test("Should fail to create a new tweet with invalid CSRF token (non-browser clients)", async () => {
      const response = await request(app)
        .post("/tweets")
        .set("dwitter-csrf-token", "wrongCSRFToken")
        .set("Authorization", `Bearer ${userOneToken}`)
        .send({ text: "New tweet!" })
        .expect(403);
      expect(response.body).toEqual({ message: "Failed CSRF check" });
    });

    test("Should fail to create a new tweet with empty text (browser clients)", async () => {
      const response = await request(app)
        .post("/tweets")
        .set("dwitter-csrf-token", CSRFToken)
        .set("Cookie", [`token=${userOneToken}`])
        .send({ text: "" })
        .expect(400);
      expect(response.body).toEqual({
        message: "text should be at least 3 characters.",
      });
    });
  });
});

describe("GET /tweets/:id", () => {
  describe("Request with valid credentials", () => {
    test("Should get a tweet by tweet id (browser clients)", async () => {
      const response = await request(app)
        .get(`/tweets/${tweetOne.id}`)
        .set("Cookie", [`token=${userOneToken}`])
        .send()
        .expect(200);
      expect(response.body).toHaveProperty("id", tweetOne.id);
      expect(response.body).toHaveProperty("username", userOne.username);
    });

    test("Should get a tweet by tweet id (non-browser clients)", async () => {
      const response = await request(app)
        .get(`/tweets/${tweetOne.id}`)
        .set("Authorization", `Bearer ${userOneToken}`)
        .send()
        .expect(200);
      expect(response.body).toHaveProperty("id", tweetOne.id);
      expect(response.body).toHaveProperty("username", userOne.username);
    });
  });

  describe("Request with invalid info", () => {
    test("Should fail to get a tweet with non-existing id (browser clients)", async () => {
      const response = await request(app)
        .get("/tweets/falseTweetId12345")
        .set("Cookie", [`token=${userOneToken}`])
        .send()
        .expect(404);
      expect(response.body).toEqual({
        message: `Tweet id(falseTweetId12345) not found`,
      });
    });

    test("Should fail to get a tweet with non-existing id (non-browser clients)", async () => {
      const response = await request(app)
        .get("/tweets/falseTweetId12345")
        .set("Authorization", `Bearer ${userOneToken}`)
        .send()
        .expect(404);
      expect(response.body).toEqual({
        message: `Tweet id(falseTweetId12345) not found`,
      });
    });
  });
});

describe("PUT /tweets/:id", () => {
  describe("Request with valid credentials", () => {
    test("Should update a tweet by tweet id (browser clients)", async () => {
      const response = await request(app)
        .put(`/tweets/${tweetOne.id}`)
        .set("dwitter-csrf-token", CSRFToken)
        .set("Cookie", [`token=${userOneToken}`])
        .send({ text: "Updated Tweet!" })
        .expect(200);
      expect(response.body).toHaveProperty("id", tweetOne.id);
      expect(response.body).toHaveProperty("username", userOne.username);
      expect(response.body).toHaveProperty("text", "Updated Tweet!");
    });

    test("Should update a tweet by tweet id (non-browser clients)", async () => {
      const response = await request(app)
        .put(`/tweets/${tweetOne.id}`)
        .set("dwitter-csrf-token", CSRFToken)
        .set("Authorization", `Bearer ${userOneToken}`)
        .send({ text: "Updated Tweet!" })
        .expect(200);
      expect(response.body).toHaveProperty("id", tweetOne.id);
      expect(response.body).toHaveProperty("username", userOne.username);
      expect(response.body).toHaveProperty("text", "Updated Tweet!");
    });
  });

  describe("Request with invalid info", () => {
    test("Should fail to update a tweet with unauthorized JWT token (browser clients)", async () => {
      await request(app)
        .put(`/tweets/${tweetOne.id}`)
        .set("dwitter-csrf-token", CSRFToken)
        .set("Cookie", [`token=${userTwoToken}`])
        .send({ text: "Updated Tweet!" })
        .expect(403);
    });

    test("Should fail to update a tweet with unauthorized JWT token (non-browser clients)", async () => {
      await request(app)
        .put(`/tweets/${tweetOne.id}`)
        .set("dwitter-csrf-token", CSRFToken)
        .set("Authorization", `Bearer ${userTwoToken}`)
        .send({ text: "Updated Tweet!" })
        .expect(403);
    });

    test("Should fail to update a tweet with invalid tweet id (browser clients)", async () => {
      await request(app)
        .put("/tweets/wrongTweetId1234")
        .set("dwitter-csrf-token", CSRFToken)
        .set("Cookie", [`token=${userOneToken}`])
        .send({ text: "Updated Tweet!" })
        .expect(404);
    });
  });
});

describe("DELETE /tweets/:id", () => {
  describe("Request with valid credentials", () => {
    test("Should delete a tweet by tweet id (browser clients)", async () => {
      await request(app)
        .delete(`/tweets/${tweetOne.id}`)
        .set("dwitter-csrf-token", CSRFToken)
        .set("Cookie", [`token=${userOneToken}`])
        .send()
        .expect(204);
    });

    test("Should delete a tweet by tweet id (non-browser clients)", async () => {
      await request(app)
        .delete(`/tweets/${tweetOne.id}`)
        .set("dwitter-csrf-token", CSRFToken)
        .set("Authorization", `Bearer ${userOneToken}`)
        .send()
        .expect(204);
    });
  });

  describe("Request with invalid info", () => {
    test("Should fail to delete a tweet with unauthorized JWT token (browser clients)", async () => {
      await request(app)
        .delete(`/tweets/${tweetOne.id}`)
        .set("dwitter-csrf-token", CSRFToken)
        .set("Cookie", [`token=${userTwoToken}`])
        .send()
        .expect(403);
    });

    test("Should fail to delete a tweet with unauthorized JWT token (non-browser clients)", async () => {
      await request(app)
        .delete(`/tweets/${tweetOne.id}`)
        .set("dwitter-csrf-token", CSRFToken)
        .set("Authorization", `Bearer ${userTwoToken}`)
        .send()
        .expect(403);
    });

    test("Should fail to delete a tweet with invalid tweet id (browser clients)", async () => {
      await request(app)
        .delete("/tweets/wrongTweetId1234")
        .set("dwitter-csrf-token", CSRFToken)
        .set("Cookie", [`token=${userOneToken}`])
        .send()
        .expect(404);
    });
  });
});

describe("POST tweets/:id/comments", () => {
  describe("Request with valid credentials", () => {
    test("Should create a new comment (browser clients)", async () => {
      const response = await request(app)
        .post(`/tweets/${tweetOne.id}/comments`)
        .set("dwitter-csrf-token", CSRFToken)
        .set("Cookie", [`token=${userOneToken}`])
        .send({ text: "This is new comment!" })
        .expect(200);
      expect(response.body).toHaveProperty("id", tweetOne.id);
      expect(response.body).toHaveProperty("username", userOne.username);
      expect(response.body.comments).toHaveLength(2);
      expect(response.body.comments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: "Comment One",
            userId: userOneId,
            username: userOne.username,
          }),
          expect.objectContaining({
            text: "This is new comment!",
            userId: userOneId,
            username: userOne.username,
          }),
        ])
      );
    });

    test("Should create a new comment (non-browser clients)", async () => {
      const response = await request(app)
        .post(`/tweets/${tweetOne.id}/comments`)
        .set("dwitter-csrf-token", CSRFToken)
        .set("Authorization", `Bearer ${userOneToken}`)
        .send({ text: "This is new comment!" })
        .expect(200);
      expect(response.body).toHaveProperty("id", tweetOne.id);
      expect(response.body).toHaveProperty("username", userOne.username);
      expect(response.body.comments).toHaveLength(2);
      expect(response.body.comments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: "Comment One",
            userId: userOneId,
            username: userOne.username,
          }),
          expect.objectContaining({
            text: "This is new comment!",
            userId: userOneId,
            username: userOne.username,
          }),
        ])
      );
    });
  });
});

// Disconnect DB
afterAll(async () => {
  Mongoose.connection.close();
});