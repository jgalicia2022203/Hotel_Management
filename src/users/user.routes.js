import { Router } from "express";
import { check } from "express-validator";
import {
  emailExists,
  userExistsById,
  usernameExists,
} from "../common/helpers/db-validators.js";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import { isAdmin } from "../common/middlewares/verify-admin.js";
import {
  deactivateUser,
  editInfo,
  getUserById,
  listUsers,
  reactivateUser,
} from "./user.controller.js";

const router = Router();

router.get("/", validateJWT, isAdmin, listUsers);

router.get(
  "/:id",
  validateJWT,
  [
    check("id").custom(userExistsById),
    check("id").isMongoId().withMessage("Invalid ID format"),
    validateFields,
  ],
  getUserById
);

router.put(
  "/:id",
  validateJWT,
  isAdmin,
  [
    check("id").custom(userExistsById),
    check("id").isMongoId().withMessage("Invalid ID format"),
    check("name").optional().notEmpty().withMessage("The name cannot be empty"),
    check("username")
      .optional()
      .notEmpty()
      .withMessage("The username cannot be empty")
      .custom(usernameExists),
    check("email")
      .optional()
      .notEmpty()
      .withMessage("The email cannot be empty")
      .custom(emailExists),
    check("password", "The password must be at least 6 characters")
      .isLength({ min: 6 })
      .optional(),
    validateFields,
  ],
  editInfo
);

router.patch(
  "/deactivate/:id",
  validateJWT,
  isAdmin,
  [
    check("id").custom(userExistsById),
    check("id").isMongoId().withMessage("Invalid ID format"),
  ],
  deactivateUser
);

router.patch(
  "/reactivate/:id",
  validateJWT,
  isAdmin,
  [
    check("id").custom(userExistsById),
    check("id").isMongoId().withMessage("Invalid ID format"),
  ],
  reactivateUser
);

export default router;
