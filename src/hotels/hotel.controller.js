import { request, response } from "express";
import Hotel from "../hotels/hotel.model.js";

export const listHotels = async (req = request, res = response) => {
  try {
    const { limit, from } = req.query;
    const query = { status: true };

    const [total, hotels] = await Promise.all([
      Hotel.countDocuments(query),
      Hotel.find(query).skip(Number(from)).limit(Number(limit)),
    ]);
    res.status(200).json({ total, hotels });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      msg: "An unexpected error ocurred during hotels list",
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
    await Hotel.save();
    res.status(201).json({
      msg: "Hotel created successfully",
      hotel,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "An unexpected error ocurred during Hotel creation",
      error: error.message,
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
