import { randomUUID } from "node:crypto";

const PRODUCT_IMAGE = "/images/food.png";

const PRODUCTS = [
  {
    title: "Nasi Goreng Kampung",
    description: "Nasi goreng gurih dengan ayam suwir, telur, acar, dan kerupuk.",
    price: 28000,
    category: "food",
    quantity: 140,
  },
  {
    title: "Mie Goreng Jawa",
    description: "Mie goreng manis gurih dengan kol, ayam, telur, dan bawang goreng.",
    price: 26000,
    category: "food",
    quantity: 135,
  },
  {
    title: "Soto Ayam Lamongan",
    description: "Soto ayam berkuah kuning dengan soun, telur, dan koya gurih.",
    price: 24000,
    category: "food",
    quantity: 120,
  },
  {
    title: "Ayam Geprek Sambal Matah",
    description: "Ayam goreng renyah dengan sambal matah segar dan nasi hangat.",
    price: 30000,
    category: "food",
    quantity: 130,
  },
  {
    title: "Sate Ayam Madura",
    description: "Sate ayam bakar dengan saus kacang khas dan lontong lembut.",
    price: 32000,
    category: "food",
    quantity: 110,
  },
  {
    title: "Rendang Daging Padang",
    description: "Rendang daging sapi empuk dengan bumbu kaya rempah dan nasi.",
    price: 38000,
    category: "food",
    quantity: 105,
  },
  {
    title: "Nasi Uduk Betawi",
    description: "Nasi uduk harum santan dengan ayam goreng, bihun, dan sambal.",
    price: 29000,
    category: "food",
    quantity: 125,
  },
  {
    title: "Bakmi Goreng Seafood",
    description: "Bakmi goreng dengan udang, cumi, sayuran, dan rasa smokey.",
    price: 34000,
    category: "food",
    quantity: 115,
  },
  {
    title: "Es Teh Manis",
    description: "Teh melati dingin yang manis dan menyegarkan.",
    price: 8000,
    category: "beverage",
    quantity: 180,
  },
  {
    title: "Es Jeruk Peras",
    description: "Jeruk peras segar dengan rasa asam manis alami.",
    price: 12000,
    category: "beverage",
    quantity: 170,
  },
  {
    title: "Kopi Susu Aren",
    description: "Espresso dengan susu creamy dan gula aren khas Indonesia.",
    price: 18000,
    category: "beverage",
    quantity: 165,
  },
  {
    title: "Wedang Jahe",
    description: "Minuman jahe hangat dengan aroma rempah yang menenangkan.",
    price: 14000,
    category: "beverage",
    quantity: 140,
  },
  {
    title: "Es Cendol",
    description: "Cendol dengan santan, gula merah, dan es serut lembut.",
    price: 16000,
    category: "beverage",
    quantity: 150,
  },
  {
    title: "Jus Alpukat Cokelat",
    description: "Jus alpukat kental dengan sirup cokelat yang legit.",
    price: 20000,
    category: "beverage",
    quantity: 145,
  },
  {
    title: "Pisang Goreng Madu",
    description: "Pisang goreng renyah dengan siraman madu hangat.",
    price: 18000,
    category: "dessert",
    quantity: 120,
  },
  {
    title: "Klepon Pandan",
    description: "Klepon lembut isi gula merah dengan balutan kelapa parut.",
    price: 15000,
    category: "dessert",
    quantity: 110,
  },
  {
    title: "Es Campur Nusantara",
    description: "Es campur isi tape, cincau, nangka, alpukat, dan sirup.",
    price: 22000,
    category: "dessert",
    quantity: 115,
  },
  {
    title: "Puding Gula Aren",
    description: "Puding lembut dengan saus gula aren yang harum.",
    price: 17000,
    category: "dessert",
    quantity: 100,
  },
  {
    title: "Martabak Mini Cokelat Keju",
    description: "Martabak mini tebal dengan topping cokelat dan keju melimpah.",
    price: 23000,
    category: "dessert",
    quantity: 105,
  },
  {
    title: "Dadar Gulung Kelapa",
    description: "Dadar gulung hijau pandan isi unti kelapa manis.",
    price: 16000,
    category: "dessert",
    quantity: 95,
  },
];

export default {
  async up(queryInterface) {
    const timestamp = new Date();

    await queryInterface.bulkInsert(
      "product",
      PRODUCTS.map((product) => ({
        uuid: randomUUID(),
        image: PRODUCT_IMAGE,
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        quantity: product.quantity,
        created_at: timestamp,
        updated_at: timestamp,
        deleted_at: null,
      })),
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("product", {
      title: {
        [Sequelize.Op.in]: PRODUCTS.map((product) => product.title),
      },
    });
  },
};
