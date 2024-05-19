import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The user reference is required"],
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: [true, "The hotel reference is required"],
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "The room reference is required"],
  },
  startDate: {
    type: Date,
    required: [true, "The start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "The end date is required"],
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "completed"],
    default: "confirmed",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
});

reservationSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

reservationSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export default mongoose.model("Booking", reservationSchema);
