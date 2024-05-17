export const validRole = (req, res, next) => {
  const validRoles = ["CLIENT", "ADMIN", "ADMIN_HOTEL"];
  const { role } = req.body;

  if (role) {
    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: "Invalid role provided" });
    }
  }
  next();
};
