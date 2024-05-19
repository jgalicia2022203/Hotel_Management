import { request, response } from "express";
import Service from "./service.model.js";

export const listServices = async (req = request, res = response) => {
  try {
    const { limit = 10, from = 0 } = req.query;
    const [total, services] = await Promise.all([
      Service.countDocuments(),
      Service.find().skip(Number(from)).limit(Number(limit)).populate("hotel"),
    ]);
    res.status(200).json({ total, services });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during services list." });
  }
};

// Create a new service
export const createService = async (req, res) => {
  try {
    const { name, description, price, hotel } = req.body;
    const service = new Service({ name, description, price, hotel });
    await service.save();
    res.status(201).json({ msg: "Service created successfully", service });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during service creation." });
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {
  const id = req.params.id;
  try {
    const service = await Service.findById(id).populate("hotel");
    if (!service) {
      return res.status(404).json({ msg: "Service not found." });
    }
    res.status(200).json({ service });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during fetching service." });
  }
};

// Edit service information
export const editService = async (req, res) => {
  const id = req.params.id;
  const { ...rest } = req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(id, rest, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ msg: "Service successfully updated!", service: updatedService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating the service." });
  }
};

// Deactivate a service
export const deactivateService = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { available: false },
      { new: true }
    );
    res.json({
      msg: "Service deactivated successfully.",
      service: { id: updatedService._id, available: updatedService.available },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deactivating the service." });
  }
};
