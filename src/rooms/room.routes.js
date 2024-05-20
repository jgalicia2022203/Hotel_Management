import { Router } from "express";
import { check } from "express-validator";
import {
  amenitiesExistsById,
  hotelExistsById,
  roomExistsById,
  roomExistsInHotel,
} from "../common/helpers/db-validators.js";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import { isAdmin } from "../common/middlewares/verify-admin.js";
import {
  createRoom,
  editRoom,
  getRoomById,
  listRooms,
  maintenanceRoom,
} from "./room.controller.js";

const router = Router();

router.get("/", validateJWT, isAdmin, listRooms);

router.get(
  "/:id",
  validateJWT,
  isAdmin,
  [
    check("id").custom(roomExistsById),
    check("id").isMongoId().withMessage("Invalid ID format"),
    validateFields,
  ],
  getRoomById
);

router.post(
  "/",
  validateJWT,
  isAdmin,
  [
    check("room_number")
      .notEmpty()
      .withMessage("the room number can't be empty")
      .custom((value, { req }) => roomExistsInHotel(req.body.hotel, value)),
    check("type").notEmpty().withMessage("the type cannot be empty"),
    check("capacity").notEmpty().withMessage("the capacity cannot be empty"),
    check("price_per_night")
      .notEmpty()
      .withMessage("the price per night cannot be empty"),
    check("hotel")
      .notEmpty()
      .withMessage("the hotel cannot be empty")
      .custom(hotelExistsById),
    check("amenities")
      .optional()
      .notEmpty()
      .withMessage("the amenities can't be empty")
      .custom(amenitiesExistsById),
    check("images")
      .optional()
      .not()
      .isEmpty()
      .withMessage("the images can't be empty"),
    validateFields,
  ],
  createRoom
);

router.put(
  "/:id",
  validateJWT,
  isAdmin,
  [
    check("id").custom(roomExistsById),
    check("id").isMongoId().withMessage("Invalid ID format"),
    check("room_number")
      .optional()
      .notEmpty()
      .withMessage("the room number can't be empty")
      .custom(roomExistsInHotel),
    check("type").optional().notEmpty().withMessage("the type cannot be empty"),
    check("capacity")
      .optional()
      .notEmpty()
      .withMessage("the capacity cannot be empty"),
    check("price_per_night")
      .optional()
      .notEmpty()
      .withMessage("the price per night cannot be empty"),
    check("hotel")
      .optional()
      .notEmpty()
      .withMessage("the hotel cannot be empty")
      .custom(hotelExistsById),
    check("amenities")
      .optional()
      .notEmpty()
      .withMessage("the amenities can't be empty")
      .custom(amenitiesExistsById),
    check("images")
      .optional()
      .not()
      .isEmpty()
      .withMessage("the images can't be empty"),
    validateFields,
  ],
  editRoom
);

router.patch(
  "/:id",
  validateJWT,
  isAdmin,
  [
    check("id").custom(roomExistsById),
    check("id").isMongoId().withMessage("Invalid ID format"),
    validateFields,
  ],
  maintenanceRoom
);

export default router;
