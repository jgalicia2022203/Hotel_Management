export const validRole = (req, res, next) => {
  console.log(req.body);
  const validRoles = ["CLIENT", "ADMIN", "ADMIN_HOTEL"];
  const { role } = req.body;
  if (role) {
    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: "Invalid role provided" });
    }
  } else {
    next();
  }
};
