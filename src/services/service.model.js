import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The service name is required"],
  },
  description: {
    type: String,
    required: [true, "The service description is required"],
  },
  available: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    required: [true, "The service price is required"],
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: [true, "The hotel reference is required"],
  },
});

serviceSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export default mongoose.model("Service", serviceSchema);
