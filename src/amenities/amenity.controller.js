import { request, response } from "express";
import Amenity from "./amenity.model.js";

// List all amenities with pagination
export const listAmenities = async (req = request, res = response) => {
  try {
    const { limit, from } = req.query;
    const [total, amenities] = await Promise.all([
      Amenity.countDocuments(),
      Amenity.find().skip(Number(from)).limit(Number(limit)),
    ]);
    res.status(200).json({ total, amenities });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during amenities list." });
  }
};

// Create a new amenity
export const createAmenity = async (req, res) => {
  try {
    const { description } = req.body;
    const amenity = new Amenity({ description });
    await amenity.save();
    res.status(201).json({ msg: "Amenity created successfully", amenity });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during amenity creation." });
  }
};

// Get amenity by ID
export const getAmenityById = async (req, res) => {
  const id = req.params.id;
  try {
    const amenity = await Amenity.findById(id);
    res.status(200).json({ amenity });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during fetching amenity." });
  }
};

// Update amenity information
export const updateAmenity = async (req, res) => {
  const id = req.params.id;
  const { description } = req.body;

  try {
    const updatedAmenity = await Amenity.findByIdAndUpdate(
      id,
      { description },
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json({ msg: "Amenity updated successfully", amenity: updatedAmenity });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Error updating amenity." });
  }
};

// Delete an amenity
export const deleteAmenity = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedAmenity = await Amenity.findByIdAndDelete(id);
    res.json({
      msg: "Amenity deleted successfully",
      amenity: deletedAmenity.description,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Error deleting amenity." });
  }
};
