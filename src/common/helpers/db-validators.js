import Amenity from "../../amenities/amenity.model.js";
import Hotel from "../../hotels/hotel.model.js";
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

export const amenityExists = async (description = "") => {
  const amenityExists = await Amenity.findOne({ description });
  if (amenityExists) {
    throw new Error(`The amenity: ${description} already exists in database`);
  }
};

export const hotelExists = async (name = "", { req }) => {
  const existingHotel = await Hotel.findOne({ name });
  if (existingHotel && existingHotel._id.toString() !== req.params.id) {
    throw new Error(`The hotel: ${name} already exists in database`);
  }
};
