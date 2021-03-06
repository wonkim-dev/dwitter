import express from "express";
import "express-async-errors";
import { body } from "express-validator";
import { isAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validator.js";

const router = express.Router();

const validateText = [
  body("text")
    .trim()
    .isLength({ min: 3 })
    .withMessage("text should be at least 3 characters."),
  validate,
];

export default function tweetsRouter(tweetController) {
  router.get("/", isAuth, tweetController.getTweets);

  router.get("/:id", isAuth, tweetController.getTweet);

  router.post("/", isAuth, validateText, tweetController.createTweet);

  router.put("/:id", isAuth, validateText, tweetController.updateTweet);

  router.delete("/:id", isAuth, tweetController.deleteTweet);

  router.post(
    "/:id/comments",
    isAuth,
    validateText,
    tweetController.createComment
  );

  router.put(
    "/:id/comments/:commentId",
    isAuth,
    validateText,
    tweetController.updateComment
  );

  router.delete(
    "/:id/comments/:commentId",
    isAuth,
    tweetController.deleteComment
  );

  return router;
}
