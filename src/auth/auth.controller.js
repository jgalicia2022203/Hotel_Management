import bcryptjs from "bcryptjs";
import { generateJWT } from "../common/helpers/generate-jwt.js";
import User from "../users/user.model.js";

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
      msg: "Welcome!",
      user,
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Contact the administrator",
    });
  }
};
