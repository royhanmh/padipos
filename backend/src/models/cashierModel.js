import { Cashier } from "./index.js";

const toPlain = (instance) => instance.get({ plain: true });

export const findCashierByEmail = async (email) => {
  const cashier = await Cashier.findOne({ where: { email } });
  return cashier ? toPlain(cashier) : null;
};

export const findCashierByUuid = async (uuid) => {
  const cashier = await Cashier.findOne({
    where: { uuid },
    attributes: { exclude: ["password"] },
  });
  return cashier ? toPlain(cashier) : null;
};

export const findCashierInstanceByUuid = async (uuid) => {
  return Cashier.findOne({ where: { uuid } });
};

export const findCashierInstanceByEmail = async (email) => {
  return Cashier.findOne({ where: { email } });
};

export const createCashier = async (payload) => {
  const cashier = await Cashier.create(payload);
  const plain = toPlain(cashier);
  delete plain.password;
  return plain;
};
