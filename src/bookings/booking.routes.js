import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import { isAdmin } from "../common/middlewares/verify-admin.js";

import {
  cancelBooking,
  createBooking,
  editBooking,
  getBookingById,
  listBookings,
} from "./booking.controller.js";

const router = Router();

router.get("/", validateJWT, isAdmin, listBookings);

router.get("/:id", validateJWT, isAdmin, getBookingById);

router.post(
  "/",
  validateJWT,
  isAdmin,
  [
    check("user").notEmpty().withMessage("the user is needed"),
    check("hotel").notEmpty().withMessage("the hotel is needed"),
    check("room").notEmpty().withMessage("the room is needed"),
    check("startDate").notEmpty().withMessage("start date is needed"),
    check("endDate").notEmpty().withMessage("end date is needed"),
    validateFields,
  ],
  createBooking
);

router.put(
  "/:id",
  validateJWT,
  isAdmin,
  [
    check("user").optional().notEmpty().withMessage("the user is needed"),
    check("hotel").optional().notEmpty().withMessage("the hotel is needed"),
    check("room").optional().notEmpty().withMessage("the room is needed"),
    check("startDate")
      .optional()
      .notEmpty()
      .withMessage("start date is needed"),
    check("endDate").optional().notEmpty().withMessage("end date is needed"),
    validateFields,
  ],
  editBooking
);

router.patch("/:id", validateJWT, isAdmin, cancelBooking);

export default router;
