import bcrypt from "bcryptjs";
import { Router } from "express";
import { check } from "express-validator";
import {
  emailExists,
  usernameExists,
} from "../common/helpers/db-validators.js";
import { validateFields } from "../common/middlewares/validate-fields.js";
import validateJWT from "../common/middlewares/validate-jwt.js";
import User from "../users/user.model.js";
import { auth, register } from "./auth.controller.js";

const router = Router();

router.post(
  "/login",
  [
    check("email", "This email is not valid").isEmail(),
    check("password", "The password is obligatory").not().isEmpty(),
    validateFields,
  ],
  auth
);

router.post(
  "/register",
  [
    check("name").notEmpty().withMessage("The name cannot be empty"),
    check("username")
      .notEmpty()
      .withMessage("The username cannot be empty")
      .custom(usernameExists),
    check("email")
      .notEmpty()
      .withMessage("The email cannot be empty")
      .isEmail()
      .withMessage("The email is invalid")
      .custom(emailExists),
    check("password")
      .notEmpty()
      .withMessage("The password is obligatory")
      .isLength({ min: 6 })
      .withMessage("The password must be at least 6 characters"),
    validateFields,
  ],
  register
);

// In your routes file
router.post("/verify-password", validateJWT, async (req, res) => {
  const { password } = req.body;
  const userId = req.user._id; // assuming validateJWT attaches user to req

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password is incorrect" });
    }

    res.status(200).json({ msg: "Password verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
