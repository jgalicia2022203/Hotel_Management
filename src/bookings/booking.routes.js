import express from "express";
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

const router = express.Router();

router.get("/", validateJWT, isAdmin, listBookings);
router.get("/:id", validateJWT, isAdmin, getBookingById);

router.post(
  "/",
  validateJWT,
  [
    check("user").notEmpty().withMessage("The user is required"),
    check("hotel").notEmpty().withMessage("The hotel is required"),
    check("room").notEmpty().withMessage("The room is required"),
    check("startDate").notEmpty().withMessage("The start date is required"),
    check("endDate").notEmpty().withMessage("The end date is required"),
    validateFields,
  ],
  createBooking
);

router.put(
  "/:id",
  validateJWT,
  [
    check("user").optional().notEmpty().withMessage("The user is required"),
    check("hotel").optional().notEmpty().withMessage("The hotel is required"),
    check("room").optional().notEmpty().withMessage("The room is required"),
    check("startDate")
      .optional()
      .notEmpty()
      .withMessage("The start date is required"),
    check("endDate")
      .optional()
      .notEmpty()
      .withMessage("The end date is required"),
    validateFields,
  ],
  editBooking
);

router.patch("/:id", validateJWT, isAdmin, cancelBooking);

export default router;
