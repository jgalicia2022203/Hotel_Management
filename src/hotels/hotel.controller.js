import { response } from "express";
import Hotel from '../hotels/hotel.model.js' ;

export const getAllHotels = async (req, res = response) => {
    try {
        const hotels = await Hotel.find();
        res.json({ hotels });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error retrieving hotels',
            error: error.message
        });
    }
};

export const createHotel = async (req, res = response) => {
    try {
        if (!req.usuario || req.usuario.role !== 'ADMIN_HOTEL') {
            return res.status(403).json({ msg: "You do not have permission to create a hotel" });
        }

        const hotel = new Hotel(req.body);
        await hotel.save();
        res.status(201).json({
            msg: 'Hotel created successfully',
            hotel
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error creating hotel',
            error: error.message
        });
    }
};

export const updateHotel = async (req, res = response) => {
    const { id } = req.params;
    try {
        const hotel = await Hotel.findByIdAndUpdate(id, req.body, { new: true });
        res.json({
            msg: 'Hotel updated successfully',
            hotel
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error updating hotel',
            error: error.message
        });
    }
};

export const deleteHotel = async (req, res = response) => {
    const { id } = req.params;
    try {
        const hotel = await Hotel.findByIdAndDelete(id);
        res.json({
            msg: 'Hotel deleted successfully',
            hotel
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error deleting hotel',
            error: error.message
        });
    }
};
