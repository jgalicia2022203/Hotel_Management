import bcrypt from "bcryptjs";
import { request, response } from "express";
import User from "../users/user.model.js";

export const listUsers = async (req = request, res = response) => {
  try {
    const { limit, from } = req.query;

    const [total, users] = await Promise.all([
      User.countDocuments(),
      User.find().skip(Number(from)).limit(Number(limit)),
    ]);

    res.status(200).json({
      total,
      users,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      msg: "An unexpected error occurred during user list.",
    });
  }
};

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = new User({ name, username, email, password });
    await user.save();
    res.status(201).json({
      msg: "User Registered in the database!",
      user,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      msg: "An unexpected error occurred during user registration.",
    });
  }
};

export const editInfo = async (req, res) => {
  const id = req.params.id;
  const { password, ...rest } = req.body;

  try {
    if (password) {
      const salt = await bcrypt.genSalt(10);
      rest.password = await bcrypt.hash(password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(id, rest, { new: true });
    res.status(200).json({
      msg: "User successfully updated!",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating the user." });
  }
};

export const deactivateUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status: false },
      { new: true }
    );
    res.json({
      msg: "Account deactivated successfully.",
      user: { id: updatedUser._id, status: updatedUser.status },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deactivating the user." });
  }
};
