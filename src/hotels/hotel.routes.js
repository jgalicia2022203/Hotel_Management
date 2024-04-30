import { Router } from "express";
import { getAllHotels, createHotel, updateHotel, deleteHotel } from './hotel.controller.js';
import { validarJWT} from "../common/middlewares/validate-jwt.js";
import { isAdmin, isClient } from "../common/middlewares/verify-admin.js";

const router = Router();


router.get("/", getAllHotels);

router.post("/", validarJWT, isAdmin, createHotel);

router.put("/:id", validarJWT, isAdmin, updateHotel);

router.delete("/:id", validarJWT, isAdmin, deleteHotel);

export default router;
