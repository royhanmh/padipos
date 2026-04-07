import Joi from "joi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findAdminByEmail,
  findAdminByUuid,
  createAdmin,
} from "../models/adminModel.js";
import {
  findCashierByEmail,
  findCashierByUuid,
  createCashier,
} from "../models/cashierModel.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(6).required(),
});

const registerSchema = Joi.object({
  username: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(6).required(),
  image_profile: Joi.string().trim().allow("", null),
});

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// ─── Admin Auth ──────────────────────────────────────────────

export const loginAdminHandler = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(400).json({
        message: "Validation failed.",
        errors: error.details.map((d) => d.message),
      });
      return;
    }

    const admin = await findAdminByEmail(value.email);

    if (!admin) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    if (admin.status !== "active") {
      res.status(403).json({ message: "Account is not active." });
      return;
    }

    const isMatch = await bcrypt.compare(value.password, admin.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const token = generateToken({ uuid: admin.uuid, role: "admin" });

    res.json({
      message: "Login successful.",
      token,
      user: {
        uuid: admin.uuid,
        username: admin.username,
        email: admin.email,
        role: "admin",
        image_profile: admin.image_profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const registerAdminHandler = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(400).json({
        message: "Validation failed.",
        errors: error.details.map((d) => d.message),
      });
      return;
    }

    const existing = await findAdminByEmail(value.email);

    if (existing) {
      res.status(409).json({ message: "Email already registered." });
      return;
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);

    const admin = await createAdmin({
      username: value.username,
      email: value.email,
      password: hashedPassword,
      image_profile: value.image_profile || null,
    });

    const token = generateToken({ uuid: admin.uuid, role: "admin" });

    res.status(201).json({
      message: "Admin registered successfully.",
      token,
      user: admin,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Cashier Auth ────────────────────────────────────────────

export const loginCashierHandler = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(400).json({
        message: "Validation failed.",
        errors: error.details.map((d) => d.message),
      });
      return;
    }

    const cashier = await findCashierByEmail(value.email);

    if (!cashier) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    if (cashier.status !== "active") {
      res.status(403).json({ message: "Account is not active." });
      return;
    }

    const isMatch = await bcrypt.compare(value.password, cashier.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const token = generateToken({ uuid: cashier.uuid, role: "cashier" });

    res.json({
      message: "Login successful.",
      token,
      user: {
        uuid: cashier.uuid,
        username: cashier.username,
        email: cashier.email,
        role: "cashier",
        image_profile: cashier.image_profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const registerCashierHandler = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(400).json({
        message: "Validation failed.",
        errors: error.details.map((d) => d.message),
      });
      return;
    }

    const existing = await findCashierByEmail(value.email);

    if (existing) {
      res.status(409).json({ message: "Email already registered." });
      return;
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);

    const cashier = await createCashier({
      username: value.username,
      email: value.email,
      password: hashedPassword,
      image_profile: value.image_profile || null,
    });

    const token = generateToken({ uuid: cashier.uuid, role: "cashier" });

    res.status(201).json({
      message: "Cashier registered successfully.",
      token,
      user: cashier,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Current User ────────────────────────────────────────

export const getMeHandler = async (req, res, next) => {
  try {
    const { uuid, role } = req.user;

    let user = null;

    if (role === "admin") {
      user = await findAdminByUuid(uuid);
    } else if (role === "cashier") {
      user = await findCashierByUuid(uuid);
    }

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.json({ ...user, role });
  } catch (error) {
    next(error);
  }
};

