import { Router } from "express";
import { validarJWT } from "../common/middlewares/validate-jwt.js";
import { isAdmin } from "../common/middlewares/verify-admin.js";
import {
  createHotel,
  deleteHotel,
  getAllHotels,
  updateHotel,
} from "./hotel.controller.js";

const router = Router();

router.get("/", getAllHotels);

router.post("/", validarJWT, isAdmin, createHotel);

router.put("/:id", validarJWT, isAdmin, updateHotel);

router.delete("/:id", validarJWT, isAdmin, deleteHotel);

export default router;
