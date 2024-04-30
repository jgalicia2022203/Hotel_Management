export const isAdmin = (req, res, next) => {
  if (req.user.role === "ADMIN" || req.user.role === "ADMIN_HOTEL") {
    return next();
  }

  return res.status(401).json({
    msg: "This action requires admin privileges",
  });
};
