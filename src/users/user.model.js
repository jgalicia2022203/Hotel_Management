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
    unique: true,
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

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.__v;
  return user;
};

export default mongoose.model("User", UserSchema);
