import User from "../../users/user.model.js";

export const emailExists = async (email = "") => {
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new Error(`The Email ${email} has already been registered`);
  }
};

export const userExistsById = async (id = "") => {
  const userExists = await User.findById(id);
  if (!userExists) {
    throw new Error(`The id: ${id} does not exist in the database`);
  }
};

export const usernameExists = async (username = "") => {
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    throw new Error(`the username ${username} is already registered`);
  }
};
