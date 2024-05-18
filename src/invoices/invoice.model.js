import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  services: [
    {
      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
      price: Number,
      date: Date,
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  issuedDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status: {
    type: String,
    enum: ["paid", "unpaid", "cancelled"],
    default: "unpaid",
  },
});

export default mongoose.model("Invoice", invoiceSchema);
