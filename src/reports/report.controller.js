import { request, response } from "express";
import Hotel from "../hotels/hotel.model.js";
import Room from "../rooms/room.model.js";

export const hotelDemandReport = async (req = request, res = response) => {
  try {
    const hotels = await Hotel.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "hotel",
          as: "bookings",
        },
      },
      {
        $project: {
          name: 1,
          demand: { $size: "$bookings" },
        },
      },
      {
        $sort: { demand: -1 },
      },
    ]);

    res.status(200).json({ hotels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error generating hotel demand report" });
  }
};

export const roomOccupancyReport = async (req = request, res = response) => {
  try {
    const { startDate, endDate } = req.query;

    const rooms = await Room.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "room",
          as: "bookings",
        },
      },
      {
        $unwind: "$bookings",
      },
      {
        $match: {
          "bookings.startDate": { $gte: new Date(startDate) },
          "bookings.endDate": { $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: "$_id",
          roomNumber: { $first: "$room_number" },
          occupancy: { $sum: 1 },
        },
      },
      {
        $sort: { occupancy: -1 },
      },
    ]);

    res.status(200).json({ rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error generating room occupancy report" });
  }
};
