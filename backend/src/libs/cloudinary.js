import { v2 as cloudinary } from "cloudinary";

export const uploadImage = async (base64String) => {
  try {
    // cloudinary automatically reads CLOUDINARY_URL from process.env
    const result = await cloudinary.uploader.upload(base64String, {
      folder: "pos-sederhana",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Failed to upload image to Cloudinary.");
  }
};

export const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes("cloudinary.com")) return;
    
    const parts = imageUrl.split("/");
    const uploadIndex = parts.indexOf("upload");
    
    if (uploadIndex === -1) return;
    
    const publicIdWithExt = parts.slice(uploadIndex + 2).join("/");
    const lastDotIndex = publicIdWithExt.lastIndexOf(".");
    const publicId = lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;
    
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted image from Cloudinary: ${publicId}`);
    }
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
  }
};
