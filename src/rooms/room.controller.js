import { request, response } from "express";
import Hotel from "../hotels/hotel.model.js";
import Room from "./room.model.js";

// List all rooms with pagination
export const listRooms = async (req = request, res = response) => {
  try {
    const { limit, from } = req.query;
    const [total, rooms] = await Promise.all([
      Room.countDocuments(),
      Room.find()
        .skip(Number(from))
        .limit(Number(limit))
        .populate({
          path: "hotel",
          select: "name -_id",
        })
        .populate({
          path: "amenities",
          select: "description -_id",
        }),
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

// Edit room information
export const editRoom = async (req, res) => {
  const id = req.params.id;
  const { ...rest } = req.body;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(id, rest, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ msg: "Room successfully updated!", room: updatedRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating the room." });
  }
};

// Put under maintenance a room
export const maintenanceRoom = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { status: "under_maintenance" },
      { new: true }
    );
    res.json({
      msg: "Room deactivated successfully.",
      room: { id: updatedRoom._id, status: updatedRoom.status },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deactivating the room." });
  }
};
