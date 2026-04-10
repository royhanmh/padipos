import jwt from "jsonwebtoken";
import { findAdminInstanceByUuid } from "../models/adminModel.js";
import { findCashierInstanceByUuid } from "../models/cashierModel.js";
import { getAuthTokenFromRequest } from "../libs/authCookie.js";

const JWT_SECRET = process.env.JWT_SECRET;

const findAuthenticatedUser = async ({ uuid, role }) => {
  if (role === "admin") {
    return findAdminInstanceByUuid(uuid);
  }

  if (role === "cashier") {
    return findCashierInstanceByUuid(uuid);
  }

  return null;
};

export const authenticate = async (req, res, next) => {
  const token = getAuthTokenFromRequest(req);

  if (!token) {
    res.status(401).json({ message: "Authentication required." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await findAuthenticatedUser(decoded);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (user.status !== "active") {
      res.status(403).json({ message: "Account is inactive." });
      return;
    }

    req.user = {
      uuid: decoded.uuid,
      role: decoded.role,
    };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired." });
      return;
    }
    res.status(401).json({ message: "Invalid token." });
  }
};
