import { Router } from "express";
import { validateJWT } from "../common/middlewares/validate-jwt.js";
import { isAdmin } from "../common/middlewares/verify-admin.js";
import { hotelDemandReport, roomOccupancyReport } from "./report.controller.js";

const router = Router();

router.get("/hotel-demand", validateJWT, isAdmin, hotelDemandReport);
router.get("/room-occupancy", validateJWT, isAdmin, roomOccupancyReport);

export default router;
