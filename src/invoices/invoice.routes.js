import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import { isAdmin } from "../common/middlewares/verify-admin.js";
import {
  createInvoice,
  listInvoices,
  updateInvoiceStatus,
} from "./invoice.controller.js";

const router = Router();

router.get("/", validateJWT, isAdmin, listInvoices);
router.post(
  "/",
  validateJWT,
  isAdmin,
  [
    check("guest").notEmpty().withMessage("the guest is needed"),
    check("hotel").notEmpty().withMessage("the hotel is needed"),
    check("room").notEmpty().withMessage("the room is needed"),
    check("services")
      .optional()
      .notEmpty()
      .withMessage("the service cannot be empty"),
    check("total")
      .notEmpty()
      .withMessage("the total cannot be empty")
      .isFloat({ min: 0.01 })
      .withMessage("the price must be greater than zero"),
    validateFields,
  ],
  createInvoice
);
router.put(
  "/:id",
  validateJWT,
  isAdmin,
  [
    check("status").notEmpty().withMessage("the status cannot be empty"),
    validateFields,
  ],
  updateInvoiceStatus
);

export default router;
