import { Router } from "express";
import { check } from "express-validator";
import {
  emailExists,
  userExistsById,
  usernameExists,
} from "../common/helpers/db-validators.js";
import { restrictDateCreationChange } from "../common/middlewares/restrict-date-creation-change.js";
import { restrictRoleChange } from "../common/middlewares/restrict-role-change.js";
import { restrictStatusChange } from "../common/middlewares/restrict-status-change.js";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import { validRole } from "../common/middlewares/validate-role.js";
import { isAdmin } from "../common/middlewares/verify-admin.js";
import { verifyUser } from "../common/middlewares/verify-user.js";
import {
  deactivateUser,
  editInfo,
  getUserById,
  listUsers,
  reactivateUser,
} from "./user.controller.js";

const router = Router();

// ADMIN ROUTES

router.get("/", validateJWT, isAdmin, listUsers);

router.get(
  "/:id",
  validateJWT,
  isAdmin,
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
    validRole,
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

// USER ROUTES

router.put(
  "/profile-settings/:id",
  validateJWT,
  verifyUser,
  [
    check("id").custom(userExistsById),
    check("id").isMongoId().withMessage("Invalid ID format"),
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
  restrictStatusChange,
  restrictRoleChange,
  restrictDateCreationChange,
  editInfo
);

router.patch(
  "/profile-settings/:id",
  validateJWT,
  verifyUser,
  [
    check("id").custom(userExistsById),
    check("id").isMongoId().withMessage("Invalid ID format"),
  ],
  deactivateUser
);

export default router;
