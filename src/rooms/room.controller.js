import { request, response } from "express";
import Room from "./room.model.js";

export const listRooms = async (req = request, res = response) => {
  try {
    const { limit, from } = req.query;
    const query = { status: true };

    const [total, rooms] = await Promise.all([
      Room.countDocuments(query),
      Room.find(query).skip(Number(from)).limit(Number(limit)),
    ]);
    res.status(200).json({ total, rooms });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      msg: "An unexpected error ocurred during rooms list",
    });
  }
};

export const createRoom = async (req, res = response) => {
  try {
    const { room_number, type, capacity, price_per_night } = req.body;
    const room = new Room({
      room_number,
      type,
      capacity,
      price_per_night,
    });
    await Room.save();
    res.status(201).json({
      msg: "Room created successfully",
      room,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "An unexpected error ocurred during Room creation",
      error: error.message,
    });
  }
};

export const editRoom = async (req, res) => {
  const id = req.params.id;
  const { ...rest } = req.body;

  try {
    const updateRoom = await Room.findByIdAndUpdate(id, rest, { new: true });
    res.status(200).json({
      msg: "Room successfully updated!",
      room: updateRoom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating the room." });
  }
};

export const deactivateRoom = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );
    res.json({
      msg: "Room deactivated successfully.",
      room: { id: updatedRoom._id, status: updatedRoom.status },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deactivating the Hotel." });
  }
};
