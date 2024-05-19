import { Router } from "express";
import { check } from "express-validator";
import {
  emailExists,
  usernameExists,
} from "../common/helpers/db-validators.js";
import { validateFields } from "../common/middlewares/validate-fields.js";
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

export default router;
