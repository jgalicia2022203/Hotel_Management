import mongoose from "mongoose";

const HotelSchema = mongoose.Schema({
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
  category: {
    type: String,
    required: [true, "The category is required"],
    default: "several",
  },
  amenities: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Amenity",
  },
  rooms: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  events: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  status: {
    type: Boolean,
    default: true,
  },
});

HotelSchema.methods.toJSON = function () {
  const hotel = this.toObject();
  return hotel;
};

export default mongoose.model("Hotel", HotelSchema);
