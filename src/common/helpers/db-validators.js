import User from "../../users/user.model.js";

export const userExistsById = async (id = "") => {
  const userExists = await User.findById(id);
  if (!userExists) {
    throw new Error(`The id: ${id} does not exist in the database`);
  }
};

export const usernameExists = async (username = "", { req }) => {
  const existingUser = await User.findOne({ username });
  if (existingUser && existingUser._id.toString() !== req.params.id) {
    throw new Error(`The username ${username} is already registered`);
  }
};

export const emailExists = async (email = "", { req }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser._id.toString() !== req.params.id) {
    throw new Error(`The email ${email} has already been registered`);
  }
};
