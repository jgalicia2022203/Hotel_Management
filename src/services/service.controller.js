import Service from "./service.model.js";

export const listServices = async (req, res) => {
  try {
    const { limit, from } = req.query;
    const services = await Service.find({ available: true })
      .populate("hotel", "name")
      .skip(Number(from))
      .limit(Number(limit));
    res.status(200).json(services);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "An error occurred while listing services",
      error: e.message,
    });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description, price, hotel } = req.body;
    const newService = new Service({ name, description, price, hotel });
    await newService.save();
    res.status(201).json({
      msg: "Event created successfully",
      newService,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      msg: "An unexpected error ocurred during Service creation",
      error: e.message,
    });
  }
};

export const editService = async (req, res) => {
  const id = req.params.id;
  const { ...rest } = req.body;
  try {
    const updatedService = await Service.findByIdAndUpdate(id, rest, {
      new: true,
    });
    res.status(200).json({
      msg: "Service successfully updated!",
      service: updatedService,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Error updating the service." });
  }
};

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
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Error deactivating the Service." });
  }
};
