import { Router } from "express";
import { getAllAmenities, createAmenity, updateAmenity, deleteAmenity } from './amenity.controller.js';
import { validarJWT } from "../common/middlewares/validate-jwt.js";
import { isAdmin } from "../common/middlewares/verify-admin.js";

const router = Router();

router.get("/", getAllAmenities);
router.post("/", validarJWT, isAdmin, createAmenity);
router.put("/:id", validarJWT, isAdmin, updateAmenity);
router.delete("/:id", validarJWT, isAdmin, deleteAmenity);

export default router;
