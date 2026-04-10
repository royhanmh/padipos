import Joi from "joi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findAdminByEmail,
  findAdminByUuid,
  findAdminInstanceByUuid,
  createAdmin,
} from "../models/adminModel.js";
import {
  findCashierByEmail,
  findCashierByUuid,
  findCashierInstanceByEmail,
  findCashierInstanceByUuid,
  createCashier,
} from "../models/cashierModel.js";
import { uploadImage, deleteImage } from "../libs/cloudinary.js";
import { clearAuthCookie, setAuthCookie } from "../libs/authCookie.js";

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

const updateProfileSchema = Joi.object({
  username: Joi.string().trim().min(1).max(100),
  email: Joi.string().email().trim(),
  image_profile: Joi.string().trim().allow("", null),
}).or("username", "email", "image_profile");

const updatePasswordSchema = Joi.object({
  current_password: Joi.string().min(1).required(),
  new_password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .required(),
});

const resetCashierPasswordSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  new_password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .required(),
});

const requestCashierPasswordResetSchema = Joi.object({
  email: Joi.string().email().trim().required(),
});

const GENERIC_RESET_REQUEST_MESSAGE =
  "If an account matches that email, the request has been processed.";
const GENERIC_RESET_PASSWORD_MESSAGE =
  "If an account matches that email, the password reset has been processed.";

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const buildAdminResponse = (admin) => ({
  uuid: admin.uuid,
  username: admin.username,
  email: admin.email,
  role: "admin",
  status: admin.status,
  image_profile: admin.image_profile,
});

const buildCashierResponse = (cashier) => ({
  uuid: cashier.uuid,
  username: cashier.username,
  email: cashier.email,
  role: "cashier",
  status: cashier.status,
  image_profile: cashier.image_profile,
});

const findMutableUserInstance = async ({ uuid, role }) => {
  if (role === "admin") {
    return findAdminInstanceByUuid(uuid);
  }

  if (role === "cashier") {
    return findCashierInstanceByUuid(uuid);
  }

  return null;
};

const buildUserResponse = (user, role) => {
  if (role === "admin") {
    return buildAdminResponse(user);
  }

  return buildCashierResponse(user);
};

const findExistingUserByRole = async (role, email) => {
  if (role === "admin") {
    return findAdminByEmail(email);
  }

  return findCashierByEmail(email);
};

const normalizeImageProfile = (value) => {
  if (!value || value === "/images/UserImage.png") {
    return null;
  }

  return value;
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
    setAuthCookie(res, token);

    res.json({
      message: "Login successful.",
      user: buildAdminResponse(admin),
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
    setAuthCookie(res, token);

    res.status(201).json({
      message: "Admin registered successfully.",
      user: buildAdminResponse(admin),
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
      res.status(403).json({
        message: "Account is pending activation. Please contact the admin first.",
      });
      return;
    }

    const isMatch = await bcrypt.compare(value.password, cashier.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const token = generateToken({ uuid: cashier.uuid, role: "cashier" });
    setAuthCookie(res, token);

    res.json({
      message: "Login successful.",
      user: buildCashierResponse(cashier),
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
      status: "nonactive",
      image_profile: value.image_profile || null,
    });

    res.status(201).json({
      message:
        "Cashier registered successfully. Your account is pending admin activation.",
      user: buildCashierResponse(cashier),
    });
  } catch (error) {
    next(error);
  }
};

export const resetCashierPasswordHandler = async (req, res, next) => {
  try {
    const { error, value } = resetCashierPasswordSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(400).json({
        message: "Validation failed.",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    const cashier = await findCashierInstanceByEmail(value.email);

    if (cashier) {
      const hashedPassword = await bcrypt.hash(value.new_password, 10);

      await cashier.update({
        password: hashedPassword,
        updated_at: new Date(),
      });
    }

    res.json({ message: GENERIC_RESET_PASSWORD_MESSAGE });
  } catch (error) {
    next(error);
  }
};

export const requestCashierPasswordResetHandler = async (req, res, next) => {
  try {
    const { error, value } = requestCashierPasswordResetSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(400).json({
        message: "Validation failed.",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    const cashier = await findCashierByEmail(value.email);

    res.json({ message: GENERIC_RESET_REQUEST_MESSAGE });
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

    res.json(buildUserResponse(user, role));
  } catch (error) {
    next(error);
  }
};

export const updateMeHandler = async (req, res, next) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(400).json({
        message: "Validation failed.",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    const currentUser = await findMutableUserInstance(req.user);

    if (!currentUser) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const updateData = {
      updated_at: new Date(),
    };

    if (typeof value.username === "string") {
      updateData.username = value.username.trim();
    }

    if (typeof value.email === "string") {
      const nextEmail = value.email.trim();

      if (nextEmail && nextEmail !== currentUser.email) {
        const existingUser = await findExistingUserByRole(req.user.role, nextEmail);

        if (existingUser && existingUser.uuid !== currentUser.uuid) {
          res.status(409).json({ message: "Email already registered." });
          return;
        }
      }

      updateData.email = nextEmail;
    }

    const hasImageProfileField = Object.prototype.hasOwnProperty.call(
      value,
      "image_profile",
    );
    const oldImageProfile = currentUser.image_profile;

    if (hasImageProfileField) {
      const nextImageProfile = normalizeImageProfile(value.image_profile);
      let uploadedImageProfile = nextImageProfile;

      if (typeof value.image_profile === "string" && value.image_profile.startsWith("data:image/")) {
        uploadedImageProfile = await uploadImage(value.image_profile);
      }

      updateData.image_profile = uploadedImageProfile;
    }

    await currentUser.update(updateData);

    await currentUser.reload();

    if (
      hasImageProfileField &&
      oldImageProfile &&
      oldImageProfile !== currentUser.image_profile &&
      oldImageProfile !== updateData.image_profile
    ) {
      deleteImage(oldImageProfile).catch(console.error);
    }

    res.json({
      message: "Profile updated successfully.",
      user: buildUserResponse(currentUser, req.user.role),
    });
  } catch (error) {
    next(error);
  }
};

export const updateMePasswordHandler = async (req, res, next) => {
  try {
    const { error, value } = updatePasswordSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(400).json({
        message: "Validation failed.",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    const currentUser = await findMutableUserInstance(req.user);

    if (!currentUser) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const isMatch = await bcrypt.compare(
      value.current_password,
      currentUser.password,
    );

    if (!isMatch) {
      res.status(401).json({ message: "Current password is invalid." });
      return;
    }

    const hashedPassword = await bcrypt.hash(value.new_password, 10);
    await currentUser.update({
      password: hashedPassword,
      updated_at: new Date(),
    });

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};

export const logoutHandler = async (_req, res, next) => {
  try {
    clearAuthCookie(res);
    res.json({ message: "Logout successful." });
  } catch (error) {
    next(error);
  }
};

