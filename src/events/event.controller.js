import { request } from "express";
import Event from "./event.model.js";

export const listEvents = async (req, res) => {
  try {
    const { limit, from } = req.query;
    const events = await Event.find()
      .populate("hotel", "name")
      .skip(Number(from))
      .limit(Number(limit));

    res.status(200).json(events);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "An error occurred while listing events",
      error: e.message,
    });
  }
};

export const createEvent = async (req = request, res) => {
  try {
    const { name, description, startDate, endDate, hotel, resources } =
      req.body;
    const newEvent = new Event({
      name,
      description,
      startDate,
      endDate,
      hotel,
      resources,
    });
    await newEvent.save();
    res.status(201).json({
      msg: "Event created successfully",
      newEvent,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      msg: "An unexpected error ocurred during Event creation",
      error: e.message,
    });
  }
};

export const editEvent = async (req, res) => {
  const id = req.params.id;
  const { ...rest } = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, rest, { new: true });
    res.status(200).json({
      msg: "Event successfully updated!",
      hotel: updatedEvent,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Error updating the event." });
  }
};

export const deactivateEvent = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );
    res.json({
      msg: "Event deactivated successfully.",
      hotel: { id: updatedEvent._id, status: updatedEvent.status },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Error deactivating the Hotel." });
  }
};
