import { Router } from "express";
import { check } from "express-validator";
import { amenityExists } from "../common/helpers/db-validators.js";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import { isAdmin } from "../common/middlewares/verify-admin.js";
import {
  createAmenity,
  deleteAmenity,
  listAmenities,
  updateAmenity,
} from "./amenity.controller.js";

const router = Router();

router.get("/", validateJWT, isAdmin, listAmenities);

router.post(
  "/",
  validateJWT,
  isAdmin,
  [
    check("description", "the description cannot be empty").not().isEmpty(),
    check(
      "description",
      "the description must have at least 5 characters"
    ).isLength({ min: 5 }),
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
    check("description", "the description cannot be empty").not().isEmpty(),
    check(
      "description",
      "the description must have at least 5 characters"
    ).isLength({ min: 5 }),
    check("description").custom(amenityExists),
    validateFields,
  ],
  updateAmenity
);

router.delete("/:id", validateJWT, isAdmin, deleteAmenity);

export default router;
