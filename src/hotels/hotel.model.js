import mongoose from 'mongoose';

const HotelSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "The name is required"],
        unique: true
    },
    address: {
        type: String,
        required: [true, "The address is required"]
    },
    category: {
        type: String,
        required: [true, "The category is required"],
        default: 'several' 
    },
    description: {
        type: String,
        required: [true, "The description is required"]
    },
    amenities: {
        type: Number,
        required: [true, "The amenities are required"]
    },
    status: {
        type: String,
        required: [true, "The status is required"]
    }
});

export default mongoose.model('Hotel', HotelSchema);
