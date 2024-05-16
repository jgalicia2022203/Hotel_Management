import Amenity from "../../amenities/amenity.model.js";
import Hotel from "../../hotels/hotel.model.js";

export const amenityExists = async (description = "") => {
  const amenityExists = await Amenity.findOne(description);
  if (amenityExists) {
    throw new Error(`The amenity: ${description} already exists in database`);
  }
};

export const hotelExists = async (name = "") => {
  const hotelExists = await Hotel.findOne(name);
  if (hotelExists) {
    throw new Error(`The hotel: ${name} already exists in database`);
  }
};
