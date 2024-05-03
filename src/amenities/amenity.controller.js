import { request, response } from "express";
import Amenity from "../amenities/amenity.model.js";

export const listAmenities = async (req = request, res = response) => {
  try {
    const { limit, from } = req.query;
    const query = { status: true };

    const [total, users] = await Promise.all([
      Amenity.countDocuments(query),
      Amenity.find(query).skip(Number(from)).limit(Number(limit)),
    ]);
    res.status(200).json({ total, users });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      msg: "An unexpected error ocurred during amenities list",
    });
  }
};

export const createAmenity = async (req, res = response) => {
  try {
    const { description } = req.body;
    const amenity = new Amenity({ description });
    await amenity.save();
    res.status(201).json({
      msg: "Amenity created successfully",
      amenity,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "An unexpected error ocurred during amenity creation",
      error: error.message,
    });
  }
};

export const updateAmenity = async (req, res = response) => {
  const { id } = req.params.id;
  const { description } = req.body;
  try {
    const updatedAmenity = await Amenity.findByIdAndUpdate(id, description, {
      new: true,
    });
    res.status(200).json({
      msg: "Amenity Updated Successfully",
      amenity: updatedAmenity,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Error updating amenity",
    });
  }
};

export const deleteAmenity = async (req, res = response) => {
  const id = req.params.id;
  try {
    const deletedAmenity = await Amenity.findByIdAndDelete(id);
    res.json({
      msg: "Amenity deleted successfully",
      deletedAmenity,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Error deleting amenity",
    });
  }
};
