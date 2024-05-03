import { Router } from "express";
import { validarJWT } from "../common/middlewares/validate-jwt.js";
import {
  actualizarHabitacion,
  crearHabitacion,
  eliminarHabitacion,
  obtenerHabitacionPorId,
  obtenerTodasLasHabitaciones,
} from "./room.controller.js";

const router = Router();

router.post("/", validarJWT, crearHabitacion); // Crear una nueva habitación
router.get("/", obtenerTodasLasHabitaciones); // Obtener todas las habitaciones
router.get("/:id", obtenerHabitacionPorId); // Obtener una habitación por su ID
router.put("/:id", validarJWT, actualizarHabitacion); // Actualizar una habitación por su ID
router.delete("/:id", validarJWT, eliminarHabitacion); // Eliminar una habitación por su ID

export default router;
