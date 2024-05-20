import { Router } from "express";
import { check } from "express-validator";
import {
  amenityExists,
  amenityExistsById,
} from "../common/helpers/db-validators.js";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import { isAdmin } from "../common/middlewares/verify-admin.js";
import {
  createAmenity,
  deleteAmenity,
  getAmenityById,
  listAmenities,
  updateAmenity,
} from "./amenity.controller.js";

const router = Router();

router.get("/", validateJWT, isAdmin, listAmenities);

router.get(
  "/:id",
  validateJWT,
  isAdmin,
  [
    check("id").custom(amenityExistsById),
    check("id").isMongoId().withMessage("Invalid ID format"),
    validateFields,
  ],
  getAmenityById
);

router.post(
  "/",
  validateJWT,
  isAdmin,
  [
    check("description")
      .notEmpty()
      .withMessage("The description cannot be empty"),
    check("description").custom(amenityExists),
    validateFields,
  ],
  createAmenity
);

router.put(
  "/:id",
  validateJWT,
  isAdmin,
  [
    check("id").custom(amenityExistsById),
    check("description")
      .notEmpty()
      .withMessage("The description cannot be empty"),
    check("description").custom(amenityExists),
    validateFields,
  ],
  updateAmenity
);

router.delete(
  "/:id",
  validateJWT,
  isAdmin,
  [
    check("id").custom(amenityExistsById),
    check("id").isMongoId().withMessage("Invalid ID format"),
    validateFields,
  ],
  deleteAmenity
);

export default router;
