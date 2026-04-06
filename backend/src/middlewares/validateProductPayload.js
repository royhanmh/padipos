import { PRODUCT_CATEGORIES } from "../types/product.js";

const PRODUCT_FIELDS = [
  "image",
  "title",
  "description",
  "price",
  "category",
  "quantity",
];

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isValidInteger = (value) => Number.isInteger(value) && value >= 0;

const normalizeString = (value) => value.trim();

export const validateProductPayload = (mode = "create") => (req, res, next) => {
  const payload = req.body ?? {};
  const nextPayload = {};
  const errors = {};

  if (typeof payload !== "object" || Array.isArray(payload)) {
    res.status(400).json({ message: "Payload must be a JSON object." });
    return;
  }

  for (const field of PRODUCT_FIELDS) {
    const value = payload[field];
    const isRequired = mode === "create";

    if (value === undefined) {
      if (isRequired) {
        errors[field] = `${field} is required.`;
      }
      continue;
    }

    if (field === "image" || field === "title" || field === "description") {
      if (!isNonEmptyString(value)) {
        errors[field] = `${field} must be a non-empty string.`;
        continue;
      }

      nextPayload[field] = normalizeString(value);
      continue;
    }

    if (field === "category") {
      if (!isNonEmptyString(value) || !PRODUCT_CATEGORIES.includes(value.trim())) {
        errors[field] = `category must be one of: ${PRODUCT_CATEGORIES.join(", ")}.`;
        continue;
      }

      nextPayload[field] = value.trim();
      continue;
    }

    if (!isValidInteger(value)) {
      errors[field] = `${field} must be an integer greater than or equal to 0.`;
      continue;
    }

    nextPayload[field] = value;
  }

  if (mode === "update" && Object.keys(nextPayload).length === 0) {
    res.status(400).json({ message: "At least one product field is required." });
    return;
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      message: "Product payload is invalid.",
      errors,
    });
    return;
  }

  req.validatedProductPayload = nextPayload;
  next();
};
