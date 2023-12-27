const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const excludedRoutes = [
    "/auth/login",
    "/auth/signup",
    "/check",
    "/apiforimage",
    "/auth/temp-signup",
    "/",
    "/getdata",
  ]; // Add excluded routes here

  if (excludedRoutes.includes(req.path)) {
    // If the route is excluded, move to the next middleware
    next();
  } else if (req.path.startsWith("/admin")) {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.JWT_ADMIN_SECRET, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Invalid Admin token" });
        }
        req.userId = decodedToken.userId;
        next();
      });
    } else {
      res.status(401).json({ message: "No Admin token provided" });
    }
  } else {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Invalid  token" });
        }
        req.userId = decodedToken.userId;
        next();
      });
    } else {
      res.status(401).json({ message: "No token provided" });
    }
  }
};

module.exports = { verifyToken };
