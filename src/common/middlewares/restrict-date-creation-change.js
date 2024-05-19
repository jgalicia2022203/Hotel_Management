export const restrictDateCreationChange = (req, res, next) => {
  if (req.body.created_at) {
    return res.status(403).json({
      msg: "You do not have permission to change your account date of creation.",
    });
  }

  next();
};
