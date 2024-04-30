import Room from './room.model.js';

export const crearHabitacion = async (req, res) => {
    try {
        const { room_number, type, capacity, price_per_night, hotel_id, availability } = req.body;
        const nuevaHabitacion = new Room({
            room_number,
            type,
            capacity,
            price_per_night,
            hotel_id,
            availability
        });

        const habitacionGuardada = await nuevaHabitacion.save();
        res.status(201).json(habitacionGuardada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la habitación' });
    }
};

export const obtenerTodasLasHabitaciones = async (req, res) => {
    try {
        const habitaciones = await Room.find();
        res.json(habitaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las habitaciones' });
    }
};

export const obtenerHabitacionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const habitacion = await Room.findById(id);
        if (!habitacion) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }
        res.json(habitacion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la habitación' });
    }
};

export const actualizarHabitacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { room_number, type, capacity, price_per_night, hotel_id, availability } = req.body;

        const habitacionActualizada = await Room.findByIdAndUpdate(id, {
            room_number,
            type,
            capacity,
            price_per_night,
            hotel_id,
            availability
        }, { new: true });

        if (!habitacionActualizada) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }
        res.json(habitacionActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la habitación' });
    }
};

export const eliminarHabitacion = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar el rol del usuario
        if (req.usuario.role !== 'ADMIN') {
            return res.status(403).json({ error: 'No tiene permisos para eliminar habitaciones' });
        }

        const habitacionEliminada = await Room.findByIdAndDelete(id);
        if (!habitacionEliminada) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }
        res.json({ mensaje: 'Habitación eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la habitación' });
    }
};
