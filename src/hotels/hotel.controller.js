import { response } from "express";
import Hotel from "../hotels/hotel.model.js";

export const listHotels = async (req, res) => {
  try {
    const { limit, from } = req.query;

    const hotels = await Hotel.find()
      .populate("amenities")
      .populate({
        path: "rooms",
        match: { availability: true },
        select: "room_number type price_per_night",
      })
      .skip(Number(from))
      .limit(Number(limit));

    res.status(200).json(hotels);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "An error occurred while listing hotels",
      error: e.message,
    });
  }
};

export const createHotel = async (req, res = response) => {
  try {
    const { name, description, address, category, amenities } = req.body;
    const hotel = new Hotel({
      name,
      description,
      address,
      category,
      amenities,
    });
    await hotel.save();
    res.status(201).json({
      msg: "Hotel created successfully",
      hotel,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "An unexpected error ocurred during Hotel creation",
      error: e.message,
    });
  }
};

export const editHotel = async (req, res) => {
  const id = req.params.id;
  const { ...rest } = req.body;

  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(id, rest, { new: true });
    res.status(200).json({
      msg: "Hotel successfully updated!",
      hotel: updatedHotel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating the hotel." });
  }
};

export const deactivateHotel = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );
    res.json({
      msg: "Hotel deactivated successfully.",
      hotel: { id: updatedHotel._id, status: updatedHotel.status },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deactivating the Hotel." });
  }
};
