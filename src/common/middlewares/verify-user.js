export const verifyUser = (req, res, next) => {
  const userIdFromParams = req.params.id;
  const userIdFromToken = req.user._id.toString();

  if (userIdFromParams !== userIdFromToken) {
    return res.status(403).json({
      msg: "You cannot modify or delete another user!.",
    });
  }
  next();
};
