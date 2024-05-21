import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import { isAdmin } from "../common/middlewares/verify-admin.js";
import {
  cancelEvent,
  createEvent,
  editEvent,
  getEventById,
  listEvents,
} from "./event.controller.js";

const router = Router();
router.get("/", validateJWT, listEvents);

router.get("/:id", validateJWT, isAdmin, getEventById);

router.post(
  "/",
  validateJWT,
  isAdmin,
  [
    check("name").notEmpty().withMessage("the name cannot be empty"),
    check("description")
      .notEmpty()
      .withMessage("the description cannot be empty"),
    check("startDate").notEmpty().withMessage("start date is needed"),
    check("endDate").notEmpty().withMessage("end date is needed"),
    check("hotel").notEmpty().withMessage("hotel is needed"),
    validateFields,
  ],
  createEvent
);

router.put(
  "/:id",
  validateJWT,
  isAdmin,
  [
    check("name").optional().notEmpty().withMessage("the name cannot be empty"),
    check("description")
      .optional()
      .notEmpty()
      .withMessage("the description cannot be empty"),
    check("startDate")
      .optional()
      .notEmpty()
      .withMessage("start date is needed"),
    check("endDate").optional().notEmpty().withMessage("end date is needed"),
    check("hotel").optional().notEmpty().withMessage("hotel is needed"),
    validateFields,
  ],
  editEvent
);

router.patch("/:id", validateJWT, isAdmin, cancelEvent);

export default router;
