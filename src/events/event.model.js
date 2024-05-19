import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The event name is required"],
  },
  description: {
    type: String,
    required: [true, "The event description is required"],
  },
  startDate: {
    type: Date,
    required: [true, "The event start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "The event end date is required"],
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: [true, "The hotel reference is required"],
  },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled",
  },
  organizer: {
    type: String,
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  resources: {
    type: String,
  },
  images: [String],
});

eventSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export default mongoose.model("Event", eventSchema);
