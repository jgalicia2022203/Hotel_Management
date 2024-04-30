import { Router } from 'express';
import {
    crearHabitacion,
    obtenerTodasLasHabitaciones,
    obtenerHabitacionPorId,
    actualizarHabitacion,
    eliminarHabitacion
} from './room.controller.js';
import { validarJWT } from "../common/middlewares/validate-jwt.js";

const router = Router();

router.post('/', validarJWT, crearHabitacion); // Crear una nueva habitación
router.get('/', obtenerTodasLasHabitaciones); // Obtener todas las habitaciones
router.get('/:id', obtenerHabitacionPorId); // Obtener una habitación por su ID
router.put('/:id', validarJWT, actualizarHabitacion); // Actualizar una habitación por su ID
router.delete('/:id', validarJWT, eliminarHabitacion); // Eliminar una habitación por su ID

export default router;
