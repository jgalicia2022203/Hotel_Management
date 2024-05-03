import Amenity from "../../amenities/amenity.model.js";

export const amenityExists = async (description = "") => {
  const amenityExists = await Amenity.findOne(description);
  if (amenityExists) {
    throw new Error(`The amenity: ${description} already exists in database`);
  }
};
