import { Admin } from "./index.js";

const toPlain = (instance) => instance.get({ plain: true });

export const findAdminByEmail = async (email) => {
  const admin = await Admin.findOne({ where: { email } });
  return admin ? toPlain(admin) : null;
};

export const findAdminByUuid = async (uuid) => {
  const admin = await Admin.findOne({
    where: { uuid },
    attributes: { exclude: ["password"] },
  });
  return admin ? toPlain(admin) : null;
};

export const createAdmin = async (payload) => {
  const admin = await Admin.create(payload);
  const plain = toPlain(admin);
  delete plain.password;
  return plain;
};
