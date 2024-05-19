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
  getHotelById,
  listHotels,
} from "./hotel.controller.js";

const router = Router();

router.get("/", validateJWT, listHotels);

router.get("/:id", validateJWT, getHotelById);

router.post(
  "/",
  validateJWT,
  isAdmin,
  [
    check("name")
      .notEmpty()
      .withMessage("the name cannot be empty")
      .custom(hotelExists),
    check("description")
      .notEmpty()
      .withMessage("the description cannot be empty"),
    check("address").notEmpty().withMessage("the address cannot be empty"),
    check("phone").notEmpty().withMessage("the phone number cannot be empty"),
    check("email").notEmpty().withMessage("the email cannot be empty"),
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
    check("description")
      .optional()
      .notEmpty()
      .withMessage("the description cannot be empty"),
    check("address")
      .optional()
      .notEmpty()
      .withMessage("the address cannot be empty"),
    check("phone")
      .optional()
      .notEmpty()
      .withMessage("the phone number cannot be empty"),
    check("email")
      .optional()
      .notEmpty()
      .withMessage("the email cannot be empty"),
    validateFields,
  ],
  editHotel
);

router.patch("/:id", validateJWT, isAdmin, deactivateHotel);

export default router;
