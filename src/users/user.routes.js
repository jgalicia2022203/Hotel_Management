import { Router } from "express";
import { check } from "express-validator";
import {
  emailExists,
  usernameExists,
} from "../common/helpers/db-validators.js";
import { restrictDateCreationChange } from "../common/middlewares/restrictDateCreationChange.js";
import { restrictRoleChange } from "../common/middlewares/restrictRoleChange.js";
import { restrictStatusChange } from "../common/middlewares/restrictStatusChange.js";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import { validRole } from "../common/middlewares/validate-role.js";
import { isAdmin } from "../common/middlewares/verify-admin.js";
import { verifyUser } from "../common/middlewares/verify-user.js";
import {
  deactivateUser,
  editInfo,
  listUsers,
  register,
} from "./user.controller.js";

const router = Router();

// ADMIN ROUTES

router.get("/", validateJWT, isAdmin, listUsers);

router.post(
  "/register",
  [
    check("username", "The name is obligatory").not().isEmpty(),
    check("username").custom(usernameExists),
    check("email", "The email is obligatory").isEmail(),
    check("email").custom(emailExists),
    check("password", "The password is obligatory").not().isEmpty(),
    check("password", "The password must be at least 6 characters").isLength({
      min: 6,
    }),
    validateFields,
  ],
  register
);

router.put(
  "/:id",
  validateJWT,
  isAdmin,
  [
    check("username").custom(usernameExists),
    check("email").custom(emailExists),
    check("password", "The password must be at least 6 characters")
    .isLength({ min: 6 })
    .optional(),
    validRole,
    validateFields,
  ],
  editInfo
);

router.patch("/:id", validateJWT, isAdmin, deactivateUser);

// USER ROUTES

router.put(
  "/profile-settings/:id",
  validateJWT,
  verifyUser,
  [
    check("username").custom(usernameExists),
    check("email").custom(emailExists),
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

router.patch("/profile-settings/:id", validateJWT, verifyUser, deactivateUser);

export default router;
