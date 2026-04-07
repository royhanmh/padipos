export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    res.status(403).json({ message: "Forbidden. Insufficient permissions." });
    return;
  }
  next();
};
