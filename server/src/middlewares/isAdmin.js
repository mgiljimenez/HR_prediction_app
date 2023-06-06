module.exports =   function isAdmin(req, res, next) {
  console.log(req);
    // const user = req.user;
  
    if (req && req.isAdmin) {
      next()
    } else {
      res.status(403).json({ message: "Acceso prohibido" });
    }
  }
  
  
