import { request, response } from "express";
import Booking from "../bookings/booking.model.js";
import Room from "../rooms/room.model.js";
import Hotel from "./hotel.model.js";
// List all hotels with pagination
export const listHotels = async (req = request, res = response) => {
  try {
    const { limit = 10, from = 0 } = req.query;
    const query = { status: "available" };
    const [total, hotels] = await Promise.all([
      Hotel.countDocuments(query),
      Hotel.find(query).skip(Number(from)).limit(Number(limit)).populate({
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
export const getHotelDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id).populate("rooms amenities");
    if (!hotel) {
      return res.status(404).json({ msg: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching hotel details", error });
  }
};

// Get rooms of a specific hotel
export const getHotelRooms = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const rooms = await Room.find({ hotel: id });

    if (!rooms) {
      return res.status(404).json({ msg: "No rooms found for this hotel" });
    }

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching rooms for this hotel", error });
  }
};

export const getHotelBookings = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.find({ hotel: id }).populate("user room");

    if (!bookings.length) {
      return res.status(404).json({ msg: "No bookings found for this hotel" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings for this hotel:", error);
    res
      .status(500)
      .json({ msg: "Error fetching bookings for this hotel", error });
  }
};

export const searchHotels = async (req, res) => {
  const { address, startDate, endDate } = req.body;

  try {
    console.log("Search request received with:", {
      address,
      startDate,
      endDate,
    });

    const hotels = await Hotel.find({
      address: new RegExp(address, "i"),
    }).populate("rooms");

    const availableHotels = hotels.filter((hotel) => {
      const availableRooms = hotel.rooms.filter((room) => {
        const isBooked = room.booked_dates.some(
          (date) =>
            (new Date(startDate) >= new Date(date.startDate) &&
              new Date(startDate) <= new Date(date.endDate)) ||
            (new Date(endDate) >= new Date(date.startDate) &&
              new Date(endDate) <= new Date(date.endDate))
        );
        return !isBooked;
      });
      return availableRooms.length > 0;
    });

    console.log("Available hotels:", availableHotels);

    res.status(200).json(availableHotels);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controlador para realizar una reserva
export const bookHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, roomId, guests } = req.body;

    const room = await Room.findOne({
      _id: roomId,
      hotel: id,
      status: "available",
      $or: [
        {
          booked_dates: {
            $not: {
              $elemMatch: {
                startDate: { $lte: new Date(endDate) },
                endDate: { $gte: new Date(startDate) },
              },
            },
          },
        },
        { booked_dates: { $exists: false } },
      ],
    });

    if (!room) {
      return res
        .status(404)
        .json({ msg: "No available rooms found for the selected dates" });
    }

    room.booked_dates.push({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    room.status = "booked";
    await room.save();

    const newBooking = new Booking({
      hotel: id,
      room: room._id,
      user: req.user.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: "confirmed",
    });

    await newBooking.save();
    res.status(201).json({ msg: "Booking successful", booking: newBooking });
  } catch (error) {
    res.status(500).json({ msg: "Error booking hotel", error });
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
