import express from "express";
import "express-async-errors";
import { body } from "express-validator";
import * as authController from "../controller/auth.js";
import { validate } from "../middleware/validator.js";
import { isAuth } from "../middleware/auth.js";
import { uploadAvatar } from "../middleware/uploader.js";

const router = express.Router();

const validateCredential = [
  body("username")
    .trim()
    .isLength({ min: 5, max: 15 })
    .withMessage("username should be between 6 and 15 characters"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("password should be at least 5 characters"),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body("name").trim().notEmpty().withMessage("name is missing"),
  body("email").isEmail().normalizeEmail().withMessage("invalid email"),
  body("url")
    .isURL()
    .withMessage("invalid URL")
    .optional({ nullable: true, checkFalsy: true }),
  validate,
];

router.post("/signup", validateSignup, authController.signup);

router.post("/login", validateCredential, authController.login);

router.post("/logout", authController.logout);

router.post(
  "/avatar",
  isAuth,
  uploadAvatar,
  authController.uploadAvatarFile,
  (err, req, res, next) => {
    res.status(400).json({ message: err.message });
  }
);

router.delete("/avatar", isAuth, authController.deleteAvatarFile);

router.get("/me", isAuth, authController.me);

router.get("/csrf-token", authController.csrfToken);

export default router;
