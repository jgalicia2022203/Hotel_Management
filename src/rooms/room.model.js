import mongoose from "mongoose";

const RoomSchema = mongoose.Schema({
  room_number: {
    type: String,
    required: [true, "The room number is required"],
  },
  type: {
    type: String,
    required: [true, "The room type is required"],
  },
  capacity: {
    type: Number,
    required: [true, "The room capacity is required"],
  },
  price_per_night: {
    type: Number,
    required: [true, "The price per night is required"],
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: [true, "The hotel ID is required"],
  },
  status: {
    type: String,
    enum: ["available", "booked", "under_maintenance"],
    default: "available",
  },
  images: [
    {
      type: String,
    },
  ],
  booked_dates: [
    {
      startDate: Date,
      endDate: Date,
    },
  ],
  amenities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenity",
    },
  ],
});

RoomSchema.methods.toJSON = function () {
  const room = this.toObject();
  return room;
};

export default mongoose.model("Room", RoomSchema);
