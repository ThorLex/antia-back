const checkRole = (roles) => {
  return (req, res, next) => {
    // Assumes authMiddleware has already run and set req.user
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Authentication error: User data is missing." });
    }

    const userRole = req.user.role;

    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: You do not have the required permissions." });
    }
  };
};

module.exports = checkRole;
