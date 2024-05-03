import mongoose from "mongoose";

const AmenitySchema = mongoose.Schema({
  description: {
    type: String,
    required: [true, "The description is required"],
  },
});

AmenitySchema.methods.toJSON = function () {
  const amenity = this.toObject();
  delete amenity.__v;
  return amenity;
};

export default mongoose.model("Amenity", AmenitySchema);
