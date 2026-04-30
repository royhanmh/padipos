export const PRODUCT_IMAGE_FOLDER = "pos-sederhana/products";

const PRODUCT_IMAGE_PUBLIC_IDS = {
  "Nasi Goreng Kampung": "nasi-goreng-kampung",
  "Mie Goreng Jawa": "mie-goreng-jawa",
  "Soto Ayam Lamongan": "soto-ayam-lamongan",
  "Ayam Geprek Sambal Matah": "ayam-geprek-sambal-matah",
  "Sate Ayam Madura": "sate-ayam-madura",
  "Rendang Daging Padang": "rendang-daging-padang",
  "Nasi Uduk Betawi": "nasi-uduk-betawi",
  "Bakmi Goreng Seafood": "bakmi-goreng-seafood",
  "Es Teh Manis": "es-teh-manis",
  "Es Jeruk Peras": "es-jeruk-peras",
  "Kopi Susu Aren": "kopi-susu-aren",
  "Wedang Jahe": "wedang-jahe",
  "Es Cendol": "es-cendol",
  "Jus Alpukat Cokelat": "jus-alpukat-cokelat",
  "Pisang Goreng Madu": "pisang-goreng-madu",
  "Klepon Pandan": "klepon-pandan",
  "Es Campur Nusantara": "es-campur-nusantara",
  "Puding Gula Aren": "puding-gula-aren",
  "Martabak Mini Cokelat Keju": "martabak-mini-cokelat-keju",
  "Dadar Gulung Kelapa": "dadar-gulung-kelapa",
};

export const getProductImagePublicId = (title) => {
  const slug = PRODUCT_IMAGE_PUBLIC_IDS[title];
  if (!slug) {
    throw new Error(`Missing image public id mapping for product: ${title}`);
  }
  return `${PRODUCT_IMAGE_FOLDER}/${slug}`;
};

export const buildCloudinaryImageUrl = (publicId) => {
  const cloudNameFromUrl = process.env.CLOUDINARY_URL
    ? process.env.CLOUDINARY_URL.match(/@([^/?]+)/)?.[1]
    : null;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || cloudNameFromUrl;
  if (!cloudName) {
    throw new Error("CLOUDINARY_CLOUD_NAME is required to build product image URLs.");
  }

  const encodedPublicId = publicId
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${encodedPublicId}.jpg`;
};

export const PRODUCT_IMAGE_MAP = PRODUCT_IMAGE_PUBLIC_IDS;
