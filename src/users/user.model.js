import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name is obligatory"],
  },
  username: {
    type: String,
    required: [true, "The username is obligatory"],
  },
  email: {
    type: String,
    required: [true, "The email of the user is obligatory"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "The password is obligatory"],
  },
  role: {
    type: String,
    required: true,
    enum: ["ADMIN_HOTEL", "ADMIN", "CLIENT"],
    default: "CLIENT",
  },
  phoneNumber: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  this.set({ updated_at: new Date() });
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

export default mongoose.model("User", UserSchema);
