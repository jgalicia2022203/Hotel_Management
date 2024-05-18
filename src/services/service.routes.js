import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../common/middlewares/validate-fields.js";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import { isAdmin } from "../common/middlewares/verify-admin.js";

import {
  createService,
  deactivateService,
  editService,
  listServices,
} from "./service.controller.js";

const router = Router();

router.get("/", validateJWT, listServices);

router.post(
  "/",
  validateJWT,
  isAdmin,
  [
    check("name").notEmpty().withMessage("the name cannot be empty"),
    check("description")
      .notEmpty()
      .withMessage("the description cannot be empty"),
    check("price").notEmpty().withMessage("the price is needed"),
    check("hotel").notEmpty().withMessage("the hotel is needed"),
    validateFields,
  ],
  createService
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
    check("price").optional().notEmpty().withMessage("the price is needed"),
    check("hotel").optional().notEmpty().withMessage("the hotel is needed"),
    validateFields,
  ],
  editService
);
router.delete("/:id", validateJWT, isAdmin, deactivateService);

export default router;
