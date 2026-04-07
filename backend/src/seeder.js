import "dotenv/config";
import bcrypt from "bcryptjs";
import { sequelize, Product, Admin, Cashier } from "./models/index.js";

const seedProducts = [
  {
    image: "/images/food.png",
    title: "Gado-gado Spesial",
    description:
      "Vegetables, egg, tempe, tofu, ketupat, peanut sauce, and kerupuk.",
    price: 20000,
    category: "food",
    quantity: 50,
  },
  {
    image: "/images/food.png",
    title: "Crispy Chicken Sambal",
    description: "Crispy chicken, green sambal, cucumber, and warm rice.",
    price: 28000,
    category: "food",
    quantity: 40,
  },
  {
    image: "/images/food.png",
    title: "Savory Fried Rice",
    description:
      "Savory fried rice with shredded chicken, egg and crackers.",
    price: 25000,
    category: "food",
    quantity: 60,
  },
  {
    image: "/images/food.png",
    title: "Grilled Chicken Satay",
    description: "Grilled chicken satay with peanut glaze and lontong.",
    price: 32000,
    category: "food",
    quantity: 35,
  },
  {
    image: "/images/food.png",
    title: "Kopi Susu Aren",
    description: "Espresso, palm sugar milk, and creamy foam.",
    price: 18000,
    category: "beverage",
    quantity: 100,
  },
  {
    image: "/images/food.png",
    title: "Matcha Latte",
    description: "Earthy matcha with chilled milk and silky texture.",
    price: 22000,
    category: "beverage",
    quantity: 80,
  },
  {
    image: "/images/food.png",
    title: "Banana Caramel Cake",
    description: "Soft banana sponge with caramel cream topping.",
    price: 24000,
    category: "dessert",
    quantity: 25,
  },
  {
    image: "/images/food.png",
    title: "Chocolate Lava Cup",
    description: "Warm chocolate center with vanilla cream.",
    price: 23000,
    category: "dessert",
    quantity: 30,
  },
];

const seedUsers = async () => {
  const adminCount = await Admin.count();

  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await Admin.create({
      username: "Admin POS",
      email: "admin@possederhana.com",
      password: hashedPassword,
      status: "active",
      image_profile: null,
    });
    console.log("Seeded default admin (admin@possederhana.com / admin123).");
  } else {
    console.log(`Admin table already has ${adminCount} row(s). Skipping.`);
  }

  const cashierCount = await Cashier.count();

  if (cashierCount === 0) {
    const hashedPassword = await bcrypt.hash("kasir123", 10);
    await Cashier.create({
      username: "Kasir POS",
      email: "kasir@possederhana.com",
      password: hashedPassword,
      status: "active",
      image_profile: null,
    });
    console.log("Seeded default cashier (kasir@possederhana.com / kasir123).");
  } else {
    console.log(`Cashier table already has ${cashierCount} row(s). Skipping.`);
  }
};

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    await sequelize.sync();
    console.log("Database synced.");

    // Seed products
    const existingCount = await Product.count();

    if (existingCount > 0) {
      console.log(
        `Product table already has ${existingCount} row(s). Skipping seed.`,
      );
    } else {
      await Product.bulkCreate(seedProducts);
      console.log(`Seeded ${seedProducts.length} products successfully.`);
    }

    // Seed users
    await seedUsers();

    await sequelize.close();
    console.log("Done.");
    process.exit(0);
  } catch (error) {
    console.error("Seeder failed:", error);
    process.exit(1);
  }
};

seed();
