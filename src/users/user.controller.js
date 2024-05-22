import bcrypt from "bcryptjs";
import { request, response } from "express";
import User from "./user.model.js";

// List all users with pagination
export const listUsers = async (req = request, res = response) => {
  try {
    const { limit = 10, from = 0 } = req.query;
    const [total, users] = await Promise.all([
      User.countDocuments(),
      User.find().skip(Number(from)).limit(Number(limit)),
    ]);
    res.status(200).json({ total, users });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during user list." });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during fetching user." });
  }
};

// Edit user information
export const editInfo = async (req, res) => {
  const id = req.params.id;
  const { password, ...rest } = req.body;

  try {
    if (password) {
      const salt = await bcrypt.genSalt(10);
      rest.password = await bcrypt.hash(password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(id, rest, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({ msg: `${updatedUser.username} successfully updated!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating the user." });
  }
};

// Deactivate a user
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

// Reactivate a user
export const reactivateUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status: true },
      { new: true }
    );
    res.json({
      msg: "Account activated again successfully.",
      user: { id: updatedUser._id, status: updatedUser.status },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error activating the user again." });
  }
};
