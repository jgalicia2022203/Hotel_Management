import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name is required"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "The description is required"],
  },
  address: {
    type: String,
    required: [true, "The address is required"],
  },
  phone: {
    type: String,
    required: [true, "The phone number is required"],
  },
  email: {
    type: String,
    required: [true, "The email is required"],
  },
  category: {
    type: String,
    required: [true, "The category is required"],
    default: "several",
  },
  status: {
    type: String,
    enum: ["available", "under_maintenance", "inactive"],
    default: "available",
  },
  amenities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenity",
    },
  ],
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  images: [
    {
      type: String,
    },
  ],
});

HotelSchema.methods.toJSON = function () {
  const hotel = this.toObject();
  return hotel;
};

export default mongoose.model("Hotel", HotelSchema);
