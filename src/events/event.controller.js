import { request, response } from "express";
import Event from "./event.model.js";
// List all events with pagination
export const listEvents = async (req = request, res = response) => {
  try {
    const { limit = 10, from = 0 } = req.query;
    const [total, events] = await Promise.all([
      Event.countDocuments(),
      Event.find()
        .skip(Number(from))
        .limit(Number(limit))
        .populate("hotel attendees services"),
    ]);
    res.status(200).json({ total, events });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during events list." });
  }
};

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      hotel,
      resources,
      services,
    } = req.body;
    const event = new Event({
      name,
      description,
      startDate,
      endDate,
      hotel,
      resources,
      services,
    });
    await event.save();
    res.status(201).json({ msg: "Event created successfully", event });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during event creation." });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  const id = req.params.id;
  try {
    const event = await Event.findById(id).populate("hotel attendees services");
    if (!event) {
      return res.status(404).json({ msg: "Event not found." });
    }
    res.status(200).json({ event });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during fetching event." });
  }
};

// Edit event information
export const editEvent = async (req, res) => {
  const id = req.params.id;
  const { ...rest } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, rest, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ msg: "Event successfully updated!", event: updatedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating the event." });
  }
};

// Delete an event
export const cancelEvent = async (req, res) => {
  const eventId = req.params.id;
  try {
    const cancelledEvent = await Event.findByIdAndUpdate(
      eventId,
      { status: "cancelled" },
      { new: true }
    );
    res.json({
      msg: "Event cancelled successfully.",
      user: { id: cancelledEvent._id, status: cancelledEvent.status },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error canceling the event." });
  }
};
