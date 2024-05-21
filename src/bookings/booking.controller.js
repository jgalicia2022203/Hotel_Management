import { request, response } from "express";
import Invoice from "../invoices/invoice.model.js";
import Room from "../rooms/room.model.js";
import Booking from "./booking.model.js";

// List all bookings with pagination
export const listBookings = async (req = request, res = response) => {
  try {
    const { limit = 10, from = 0 } = req.query;
    const [total, bookings] = await Promise.all([
      Booking.countDocuments(),
      Booking.find()
        .skip(Number(from))
        .limit(Number(limit))
        .populate("user hotel room"),
    ]);
    res.status(200).json({ total, bookings });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during bookings list." });
  }
};

// Create a new booking
export const createBooking = async (req, res = response) => {
  try {
    const { user, hotel, room, startDate, endDate } = req.body;

    // Create new booking
    const booking = new Booking({ user, hotel, room, startDate, endDate });
    await booking.save();

    // Update the room with the new booking dates
    await Room.findByIdAndUpdate(room, {
      $addToSet: {
        booked_dates: {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      },
      status: "booked",
    });

    // Create invoice
    const invoice_number = `INV-${Date.now()}`;
    const total = 131.76; // Replace with the actual total calculation
    const invoice = new Invoice({
      guest: user,
      hotel,
      room,
      total,
      invoice_number,
    });
    await invoice.save();

    res
      .status(201)
      .json({ msg: "Booking created successfully", booking, invoice });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during booking creation." });
  }
};

// Get booking by ID
export const getBookingById = async (req = request, res = response) => {
  const id = req.params.id;
  try {
    const booking = await Booking.findById(id).populate("user hotel room");
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found." });
    }
    res.status(200).json({ booking });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during fetching booking." });
  }
};

// Edit booking information
export const editBooking = async (req, res) => {
  const id = req.params.id;
  const { ...rest } = req.body;

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(id, rest, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ msg: "Booking successfully updated!", booking: updatedBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating the booking." });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  const bookingId = req.params.id;
  try {
    const cancelledBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "cancelled" },
      { new: true }
    );
    res.json({
      msg: "Booking cancelled successfully.",
      user: { id: cancelledBooking._id, status: cancelledBooking.status },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error canceling the booking." });
  }
};
