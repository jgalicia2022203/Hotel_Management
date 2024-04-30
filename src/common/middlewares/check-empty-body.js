export const checkEmptyBody = (req, res, next) => {
  const body = req.body;

  if (Object.keys(body).length === 0) {
    return res.status(400).json({ msg: "Request body cannot be empty" });
  }

  next();
};
