import mongoose from 'mongoose';

const AmenitySchema = mongoose.Schema({
    description: {
        type: String,
        required: [true, "The description is required"]
    }
});

export default mongoose.model('Amenity', AmenitySchema);
