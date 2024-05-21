import { Router } from "express";
import { check } from "express-validator";
import {
  amenitiesExistsById,
  hotelExists,
  hotelExistsById,
} from "../common/helpers/db-validators.js";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import { isAdmin } from "../common/middlewares/verify-admin.js";
import {
  bookHotel,
  createHotel,
  deactivateHotel,
  editHotel,
  getHotelDetails,
  listHotels,
  searchHotels,
} from "./hotel.controller.js";

const router = Router();

router.get("/", validateJWT, listHotels);

router.post("/search", searchHotels);

router.post("/:id/book", validateJWT, bookHotel);

router.get(
  "/:id",
  [
    check("id").custom(hotelExistsById),
    check("id").isMongoId().withMessage("Invalid ID format"),
    validateFields,
  ],
  getHotelDetails
);

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
    check("category")
      .optional()
      .notEmpty()
      .withMessage("the category cannot be empty"),
    check("amenities")
      .optional()
      .notEmpty()
      .withMessage("the amenities cannot be empty")
      .custom(amenitiesExistsById),
    check("images")
      .optional()
      .notEmpty()
      .withMessage("the images cannot be empty"),
    validateFields,
  ],
  createHotel
);

router.put(
  "/:id",
  validateJWT,
  isAdmin,
  [
    check("id").custom(hotelExistsById),
    check("id").isMongoId().withMessage("Invalid ID format"),
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
    check("category")
      .optional()
      .notEmpty()
      .withMessage("the category cannot be empty"),
    check("amenities")
      .optional()
      .notEmpty()
      .withMessage("the amenities cannot be empty")
      .custom(amenitiesExistsById),
    check("images")
      .optional()
      .notEmpty()
      .withMessage("the images cannot be empty"),
    validateFields,
  ],
  editHotel
);

router.patch(
  "/:id",
  validateJWT,
  isAdmin,
  [
    check("id").custom(hotelExistsById),
    check("id").isMongoId().withMessage("Invalid ID format"),
    validateFields,
  ],
  deactivateHotel
);

export default router;
