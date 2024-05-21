import express from "express";
import { check } from "express-validator";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import { isAdmin } from "../common/middlewares/verify-admin.js";
import {
  cancelInvoice,
  createInvoice,
  downloadInvoice,
  getInvoiceById,
  listInvoices,
} from "./invoice.controller.js";

const router = express.Router();

router.get("/", validateJWT, isAdmin, listInvoices);
router.get("/:id", validateJWT, isAdmin, getInvoiceById);

router.post(
  "/",
  validateJWT,
  [
    check("guest").notEmpty().withMessage("The guest is required"),
    check("hotel").notEmpty().withMessage("The hotel is required"),
    check("room").notEmpty().withMessage("The room is required"),
    check("total")
      .notEmpty()
      .withMessage("The total is required")
      .isFloat({ min: 0.01 })
      .withMessage("The total must be greater than zero"),
    validateFields,
  ],
  createInvoice
);

router.patch("/:id", validateJWT, isAdmin, cancelInvoice);

// Route to generate and download PDF invoice
router.post("/download", validateJWT, downloadInvoice);

export default router;
