import { response } from "express";
import Amenity from '../amenities/amenity.model.js';

export const getAllAmenities = async (req, res = response) => {
    try {
        const amenities = await Amenity.find();
        res.json({ amenities });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error retrieving amenities',
            error: error.message
        });
    }
};

export const createAmenity = async (req, res = response) => {
    try {
        const amenity = new Amenity(req.body);
        await amenity.save();
        res.status(201).json({
            msg: 'Amenity created successfully',
            amenity
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error creating amenity',
            error: error.message
        });
    }
};

export const updateAmenity = async (req, res = response) => {
    const { id } = req.params;
    try {
        const amenity = await Amenity.findByIdAndUpdate(id, req.body, { new: true });
        res.json({
            msg: 'Amenity updated successfully',
            amenity
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error updating amenity',
            error: error.message
        });
    }
};

export const deleteAmenity = async (req, res = response) => {
    const { id } = req.params;
    try {
        if (req.usuario.role !== 'ADMIN') {
            return res.status(403).json({ error: 'No tiene permisos para eliminar amenidades' });
        }

        const amenity = await Amenity.findByIdAndDelete(id);
        res.json({
            msg: 'Amenity deleted successfully',
            amenity
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error deleting amenity',
            error: error.message
        });
    }
};
