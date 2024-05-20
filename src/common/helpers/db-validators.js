import mongoose from "mongoose";
import Amenity from "../../amenities/amenity.model.js";
import Hotel from "../../hotels/hotel.model.js";
import Room from "../../rooms/room.model.js";
import User from "../../users/user.model.js";

export const userExistsById = async (id = "") => {
  const userExists = await User.findById(id);
  if (!userExists) {
    throw new Error(`The id: ${id} does not exist in the database`);
  }
};

export const usernameExists = async (username = "", { req }) => {
  const existingUser = await User.findOne({ username });
  if (existingUser && existingUser._id.toString() !== req.params.id) {
    throw new Error(`The username ${username} is already registered`);
  }
};

export const emailExists = async (email = "", { req }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser._id.toString() !== req.params.id) {
    throw new Error(`The email ${email} has already been registered`);
  }
};

export const amenitiesExistsById = async (amenities = []) => {
  if (!Array.isArray(amenities)) {
    throw new Error("Amenities should be an array");
  }

  for (const id of amenities) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid amenity ID: ${id}`);
    }

    const amenity = await Amenity.findById(id);
    if (!amenity) {
      throw new Error(`Amenity with ID ${id} does not exist`);
    }
  }
};

export const amenityExistsById = async (id = "") => {
  const existingAmenity = await Amenity.findById(id);

  if (!existingAmenity) {
    throw new Error(`Amenity with id '${id}' does not exist`);
  }
};

export const amenityExists = async (description = "") => {
  const regex = new RegExp(`^${description}$`, "i");
  const existingAmenity = await Amenity.findOne({ description: regex });

  if (existingAmenity) {
    throw new Error(`Amenity '${description}' already exists`);
  }
};

export const hotelExists = async (name = "") => {
  const regex = new RegExp(`^${name}$`, "i");
  const existingHotel = await Hotel.findOne({ name: regex });
  if (existingHotel) {
    throw new Error(`Hotel '${name}' already exists`);
  }
};

export const hotelExistsById = async (id = "") => {
  const hotelExists = await Hotel.findById(id);
  if (!hotelExists) {
    throw new Error(`The id: ${id} does not exist in the database`);
  }
};

export const roomExistsById = async (id = "") => {
  const roomExists = await Room.findById(id);
  if (!roomExists) {
    throw new Error(`The id: ${id} does not exist in the database`);
  }
};

export const roomExistsInHotelById = async (hotel = "", id = "") => {
  if (!mongoose.Types.ObjectId.isValid(hotel)) {
    throw new Error(`Invalid hotel ID: ${hotel}`);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid room ID: ${id}`);
  }

  const hotelExists = await Hotel.findById(hotel).populate("rooms");
  if (!hotelExists) {
    throw new Error(`Hotel with ID ${hotel} does not exist`);
  }

  const roomExists = await Room.findOne({
    _id: { $in: hotel.rooms },
    _id: id,
  });
  if (!roomExists) {
    throw new Error(
      `Room with ID '${id}' does not exist in the hotel ${hotel}`
    );
  }
};

export const roomExistsInHotel = async (hotel = "", room_number = "") => {
  if (!mongoose.Types.ObjectId.isValid(hotel)) {
    throw new Error(`Invalid hotel ID: ${hotel}`);
  }

  const hotelExists = await Hotel.findById(hotel).populate("rooms");
  if (!hotelExists) {
    throw new Error(`Hotel with ID ${hotel} does not exist`);
  }

  const roomExists = await Room.findOne({
    _id: { $in: hotelExists.rooms },
    room_number: room_number,
  });

  if (roomExists) {
    throw new Error(
      `Room with number '${room_number}' already exists in the hotel ${hotelExists.name}`
    );
  }
};
