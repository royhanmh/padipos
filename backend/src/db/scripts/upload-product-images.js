import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";
import {
  PRODUCT_IMAGE_MAP,
  PRODUCT_IMAGE_FOLDER,
} from "../data/productImageMap.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGE_ASSET_DIR = path.resolve(__dirname, "../assets/product-images");
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const findLocalImage = async (slug) => {
  for (const ext of ALLOWED_EXTENSIONS) {
    const candidate = path.join(IMAGE_ASSET_DIR, `${slug}${ext}`);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {}
  }
  return null;
};

const ensureCloudinaryConfigured = () => {
  if (!process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error(
      "Missing Cloudinary config. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.",
    );
  }
};

const uploadOrSkip = async ({ title, slug }) => {
  const publicId = `${PRODUCT_IMAGE_FOLDER}/${slug}`;
  const existing = await cloudinary.api.resource(publicId).catch(() => null);

  if (existing?.secure_url) {
    return { title, publicId, secureUrl: existing.secure_url, action: "skip" };
  }

  const localImagePath = await findLocalImage(slug);
  if (!localImagePath) {
    throw new Error(
      `Missing local image for "${title}". Expected file: ${slug}.jpg|jpeg|png|webp in ${IMAGE_ASSET_DIR}.`,
    );
  }

  const uploaded = await cloudinary.uploader.upload(localImagePath, {
    public_id: publicId,
    overwrite: false,
    resource_type: "image",
  });

  return {
    title,
    publicId,
    secureUrl: uploaded.secure_url,
    action: "upload",
  };
};

const run = async () => {
  ensureCloudinaryConfigured();

  const entries = Object.entries(PRODUCT_IMAGE_MAP);
  const results = [];

  for (const [title, slug] of entries) {
    const result = await uploadOrSkip({ title, slug });
    results.push(result);
    console.log(`${result.action.toUpperCase()} ${title} -> ${result.secureUrl}`);
  }

  console.log(`Done. processed=${results.length}`);
};

run().catch((error) => {
  console.error("Upload product images failed:", error.message);
  process.exit(1);
});
