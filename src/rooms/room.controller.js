import { request, response } from "express";
import Hotel from "../hotels/hotel.model.js";
import Room from "./room.model.js";

// List all rooms with pagination
export const listRooms = async (req = request, res = response) => {
  try {
    const { limit = 10, from = 0 } = req.query;
    const query = {};
    const [total, rooms] = await Promise.all([
      Room.countDocuments(query),
      Room.find(query)
        .skip(Number(from))
        .limit(Number(limit))
        .populate("hotel")
        .populate("amenities"),
    ]);
    res.status(200).json({ total, rooms });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during rooms list." });
  }
};

// Get room by ID
export const getRoomById = async (req, res) => {
  const id = req.params.id;
  try {
    const room = await Room.findById(id)
      .populate({
        path: "hotel",
        select: "name -_id",
      })
      .populate({
        path: "amenities",
        select: "description -_id",
      });
    if (!room) {
      return res.status(404).json({ msg: "Room not found." });
    }
    res.status(200).json({ room });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during fetching room." });
  }
};

// Create a new room
export const createRoom = async (req, res) => {
  try {
    const {
      room_number,
      type,
      capacity,
      price_per_night,
      hotel,
      amenities = [],
      images = [],
    } = req.body;
    const room = new Room({
      room_number,
      type,
      capacity,
      price_per_night,
      hotel,
      amenities,
      images,
    });
    await room.save();
    await Hotel.findByIdAndUpdate(
      hotel,
      { $push: { rooms: room._id } },
      { new: true, useFindAndModify: false }
    );
    res.status(201).json({ msg: "Room created successfully", room });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during room creation." });
  }
};

export const editRoom = async (req, res) => {
  const id = req.params.id;
  const { room_number, type, capacity, price_per_night, status } = req.body;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { room_number, type, capacity, price_per_night, status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRoom) {
      return res.status(404).json({ msg: "Room not found." });
    }

    res
      .status(200)
      .json({ msg: "Room successfully updated!", room: updatedRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating the room." });
  }
};

// Put under maintenance a room
export const deleteRoom = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedRoom = await Room.findByIdAndDelete(id);
    res.json({
      msg: "Room deactivated successfully.",
      room: { updatedRoom },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deactivating the room." });
  }
};
