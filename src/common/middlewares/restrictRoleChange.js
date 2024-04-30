export const restrictRoleChange = (req, res, next) => {
  if (req.body.role) {
    return res.status(403).json({
      msg: "You do not have permission to change your role.",
    });
  }

  next();
};
