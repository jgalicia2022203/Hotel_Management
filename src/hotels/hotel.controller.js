import { request, response } from "express";
import Hotel from "./hotel.model.js";

// List all hotels with pagination
export const listHotels = async (req = request, res = response) => {
  try {
    const { limit, from } = req.query;
    const [total, hotels] = await Promise.all([
      Hotel.countDocuments(),
      Hotel.find().skip(Number(from)).limit(Number(limit)).populate({
        path: "amenities",
        select: "description -_id",
      }),
    ]);
    res.status(200).json({ total, hotels });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during hotel list." });
  }
};

// Get hotel by ID
export const getHotelById = async (req, res) => {
  const id = req.params.id;
  try {
    const hotel = await Hotel.findById(id)
      .populate("amenities")
      .populate("rooms");
    if (!hotel) {
      return res.status(404).json({ msg: "Hotel not found." });
    }
    res.status(200).json({ hotel });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during fetching hotel." });
  }
};

// Create a new hotel
export const createHotel = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      phone,
      email,
      amenities = [],
      images = [],
      ...rest
    } = req.body;
    const hotel = new Hotel({
      name,
      description,
      address,
      phone,
      email,
      amenities,
      images,
      ...rest,
    });
    await hotel.save();
    res.status(201).json({ msg: "Hotel created successfully", hotel });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during hotel creation." });
  }
};

// Edit hotel information
export const editHotel = async (req, res) => {
  const id = req.params.id;
  const { ...rest } = req.body;

  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(id, rest, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ msg: "Hotel successfully updated!", hotel: updatedHotel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating the hotel." });
  }
};

// Put on maintenance a hotel
export const maintenanceHotel = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      { status: "under_maintenance" },
      { new: true }
    );
    res.json({
      msg: "Hotel under maintenance successfully.",
      hotel: { id: updatedHotel._id, status: updatedHotel.status },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error putting on maintenance the hotel." });
  }
};

// Deactivate a hotel
export const deactivateHotel = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      { status: "inactive" },
      { new: true }
    );
    res.json({
      msg: "Hotel deactivated successfully.",
      hotel: { id: updatedHotel._id, status: updatedHotel.status },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deactivating the hotel." });
  }
};
