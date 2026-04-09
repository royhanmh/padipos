import bcrypt from "bcryptjs";

const DEFAULT_ADMIN = {
  uuid: "c95580b2-bb81-4f78-a3ed-fbb96b36e061",
  username: "Admin POS",
  email: "admin@possederhana.com",
  password: "admin123",
  status: "active",
  image_profile: null,
};

const DEFAULT_CASHIER = {
  uuid: "e0c7f64d-c689-4998-8f47-a941ae4cc347",
  username: "Kasir POS",
  email: "kasir@possederhana.com",
  password: "kasir123",
  status: "active",
  image_profile: null,
};

export default {
  async up(queryInterface) {
    const timestamp = new Date();
    const adminPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
    const cashierPassword = await bcrypt.hash(DEFAULT_CASHIER.password, 10);

    await queryInterface.bulkInsert("admin", [
      {
        uuid: DEFAULT_ADMIN.uuid,
        username: DEFAULT_ADMIN.username,
        email: DEFAULT_ADMIN.email,
        password: adminPassword,
        status: DEFAULT_ADMIN.status,
        image_profile: DEFAULT_ADMIN.image_profile,
        created_at: timestamp,
        updated_at: timestamp,
        deleted_at: null,
      },
    ]);

    await queryInterface.bulkInsert("cashier", [
      {
        uuid: DEFAULT_CASHIER.uuid,
        username: DEFAULT_CASHIER.username,
        email: DEFAULT_CASHIER.email,
        password: cashierPassword,
        status: DEFAULT_CASHIER.status,
        image_profile: DEFAULT_CASHIER.image_profile,
        created_at: timestamp,
        updated_at: timestamp,
        deleted_at: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("admin", {
      email: {
        [Sequelize.Op.in]: [DEFAULT_ADMIN.email],
      },
    });

    await queryInterface.bulkDelete("cashier", {
      email: {
        [Sequelize.Op.in]: [DEFAULT_CASHIER.email],
      },
    });
  },
};
