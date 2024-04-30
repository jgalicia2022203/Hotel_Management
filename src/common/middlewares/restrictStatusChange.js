export const restrictStatusChange = (req, res, next) => {
  if ("status" in req.body) {
    return res.status(403).json({
      msg: "You do not have permission to change your status.",
    });
  }
  next();
};
