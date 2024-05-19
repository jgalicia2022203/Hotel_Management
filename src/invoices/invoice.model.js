import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The guest reference is required"],
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
  services: [
    {
      service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
      price: { type: Number },
      date: { type: Date },
    },
  ],
  total: {
    type: Number,
    required: [true, "The invoice total is required"],
  },
  additional_charges: {
    type: Number,
  },
  discounts: {
    type: Number,
  },
  issuedDate: {
    type: Date,
    default: Date.now,
    required: [true, "The issued date is required"],
  },
  status: {
    type: String,
    enum: ["paid", "cancelled"],
    default: "paid",
  },
  payment_method: {
    type: String,
  },
  invoice_number: {
    type: String,
    unique: true,
  },
});

invoiceSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export default mongoose.model("Invoice", invoiceSchema);
