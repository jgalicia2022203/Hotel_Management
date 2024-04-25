import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    name:{
        type: String,
        require: [true, "The name of the user is obligatory"]
    }, 
    email:{
        type: String,
        require: [true, "The email of the user is obligatory"],
        unique: true
    },
    password:{
        type: String,
        require: [true, "The password of the user is obligatory"]
    },
    role:{
        type: String,
        require: true,
        enum: ["ADMIN_HOTEL", "VISIT_ROLE"],
        default: "ADMIN_HOTEL"
    },
    status:{
        type: Boolean,
        default: true
    }
})

UserSchema.methods.toJSON = function(){
    const {__v, password, _id, ...user} = this.toObject();
    user.uid = _id
    return user;
}

export default mongoose.model('User',UserSchema)