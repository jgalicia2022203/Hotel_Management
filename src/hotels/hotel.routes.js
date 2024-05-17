import { Router } from "express";
import { check } from "express-validator";
import { hotelExists } from "../common/helpers/db-validators.js";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import { isAdmin } from "../common/middlewares/verify-admin.js";
import {
  createHotel,
  deactivateHotel,
  editHotel,
  listHotels,
} from "./hotel.controller.js";

const router = Router();

router.get("/", validateJWT, listHotels);

router.post(
  "/",
  validateJWT,
  isAdmin,
  [
    check("name")
      .notEmpty()
      .withMessage("the name cannot be empty")
      .custom(hotelExists),
    check("description", "the description cannot be empty").notEmpty(),
    check("address", "the address cannot be empty").notEmpty(),
    check("category", "the category cannot be empty").notEmpty(),
    validateFields,
  ],
  createHotel
);

router.put(
  "/:id",
  validateJWT,
  isAdmin,
  [
    check("name")
      .optional()
      .notEmpty()
      .withMessage("the name cannot be empty")
      .custom(hotelExists),
    check("description", "the description cannot be empty")
      .optional()
      .notEmpty(),
    check("address", "the address cannot be empty").optional().notEmpty(),
    check("category", "the category cannot be empty").optional().notEmpty(),
    validateFields,
  ],
  editHotel
);

router.patch("/:id", validateJWT, isAdmin, deactivateHotel);

export default router;
