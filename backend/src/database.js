import { randomUUID } from "node:crypto";

const PRODUCT_SEED_TIMESTAMP = "2026-04-06T00:00:00.000Z";

let nextProductId = 1;

const createSeedProduct = ({
  image,
  title,
  description,
  price,
  category,
  quantity,
}) => ({
  id: nextProductId++,
  uuid: randomUUID(),
  image,
  title,
  description,
  price,
  category,
  quantity,
  created_at: PRODUCT_SEED_TIMESTAMP,
  updated_at: PRODUCT_SEED_TIMESTAMP,
  deleted_at: null,
});

export const db = {
  products: [
    createSeedProduct({
      image: "/images/food.png",
      title: "Gado-gado Special",
      description:
        "Vegetables, egg, tempe, tofu, ketupat, peanut sauce, and crackers.",
      price: 20000,
      category: "food",
      quantity: 18,
    }),
    createSeedProduct({
      image: "/images/food.png",
      title: "Ayam Geprek Sambal Ijo",
      description: "Crispy chicken, green sambal, cucumber, and warm rice.",
      price: 28000,
      category: "food",
      quantity: 14,
    }),
    createSeedProduct({
      image: "/images/food.png",
      title: "Nasi Goreng Kampung",
      description:
        "Savory fried rice with shredded chicken, egg, and crackers.",
      price: 25000,
      category: "food",
      quantity: 16,
    }),
    createSeedProduct({
      image: "/images/food.png",
      title: "Sate Ayam Lilit",
      description: "Grilled chicken satay with peanut glaze and lontong.",
      price: 32000,
      category: "food",
      quantity: 12,
    }),
    createSeedProduct({
      image: "/images/food.png",
      title: "Es Teh Lemon",
      description:
        "Cold brewed tea with fresh lemon slices and light sweetness.",
      price: 12000,
      category: "beverage",
      quantity: 30,
    }),
    createSeedProduct({
      image: "/images/food.png",
      title: "Kopi Susu Aren",
      description: "Espresso, palm sugar milk, and creamy foam.",
      price: 18000,
      category: "beverage",
      quantity: 24,
    }),
    createSeedProduct({
      image: "/images/food.png",
      title: "Matcha Latte",
      description: "Earthy matcha with chilled milk and silky texture.",
      price: 22000,
      category: "beverage",
      quantity: 20,
    }),
    createSeedProduct({
      image: "/images/food.png",
      title: "Strawberry Yakult",
      description: "Sweet strawberry blend with sparkling probiotic finish.",
      price: 19000,
      category: "beverage",
      quantity: 22,
    }),
    createSeedProduct({
      image: "/images/food.png",
      title: "Banana Caramel Cake",
      description: "Soft banana sponge with caramel cream topping.",
      price: 24000,
      category: "dessert",
      quantity: 10,
    }),
    createSeedProduct({
      image: "/images/food.png",
      title: "Klepon Cake Slice",
      description: "Pandan cake layered with coconut and palm sugar cream.",
      price: 26000,
      category: "dessert",
      quantity: 9,
    }),
    createSeedProduct({
      image: "/images/food.png",
      title: "Chocolate Lava Cup",
      description: "Warm chocolate center with vanilla cream and crumbs.",
      price: 23000,
      category: "dessert",
      quantity: 11,
    }),
    createSeedProduct({
      image: "/images/food.png",
      title: "Pisang Goreng Madu",
      description: "Fried banana fritters with honey drizzle and cheese.",
      price: 21000,
      category: "dessert",
      quantity: 13,
    }),
  ],
  getNextProductId() {
    return nextProductId++;
  },
};
