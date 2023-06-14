module.exports = function isAdmin(req, res, next) {
  const user = req.user;
  console.log(user);

  if (user && user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Acceso prohibido" });
  }
};
