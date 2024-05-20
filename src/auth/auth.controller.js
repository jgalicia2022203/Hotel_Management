import bcryptjs from "bcryptjs";
import { generateJWT } from "../common/helpers/generate-jwt.js";
import User from "../users/user.model.js";

// Login
export const auth = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Incorrect credentials, email does not exist in the database",
      });
    }
    if (!user.status) {
      return res.status(400).json({
        msg: "The user does not exist in the database",
      });
    }
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "The password is incorrect",
      });
    }
    const token = await generateJWT(user.id);

    res.status(200).json({
      msg: `Welcome ${user.username}!`,
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Contact the administrator",
    });
  }
};

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = new User({ name, username, email, password });
    await user.save();
    res.status(201).json({ msg: "User Registered, Welcome!" });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during user registration." });
  }
};
