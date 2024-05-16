import { Router } from "express";
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
    check("name", "the name cannot be empty").not().isEmpty(),
    check("name").custom(hotelExists),
    check("description", "the description cannot be empty").not().isEmpty(),
    check("address", "the address cannot be empty").not().isEmpty(),
    check("category", "the category cannot be empty")
      .not()
      .isEmpty()
      .optional(),
    validateFields,
  ],
  createHotel
);

router.put(
  "/:id",
  validateJWT,
  isAdmin,
  [check("name").custom(hotelExists), validateFields],
  editHotel
);

router.patch("/:id", validateJWT, isAdmin, deactivateHotel);

export default router;
