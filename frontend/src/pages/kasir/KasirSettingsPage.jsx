import { PiBasketLight, PiGearSixLight, PiReceiptLight } from "react-icons/pi";
import CashierOrderArchiveControl from "../../features/cashier-order-archive/components/CashierOrderArchiveControl";
import SettingsView from "../../features/settings/components/SettingsView";

const CASHIER_PROFILE = {
  name: "John Doe",
  role: "Cashier",
  image: "/images/UserImage.png",
};

const KasirSettingsPage = () => {
  return (
    <SettingsView
      layoutSidebarProps={{
        activeItem: "settings",
        variant: "kasir",
        items: [
          {
            id: "catalog",
            icon: PiBasketLight,
            label: "Catalog",
            href: "/kasir/catalog",
          },
          {
            id: "orders",
            icon: PiReceiptLight,
            label: "Orders",
            href: "/kasir/sales-report",
          },
          {
            id: "settings",
            icon: PiGearSixLight,
            label: "Settings",
            href: "/kasir/settings",
          },
        ],
      }}
      layoutTopbarProps={{
        profile: CASHIER_PROFILE,
        beforeProfile: <CashierOrderArchiveControl />,
      }}
      accountDefaults={{
        email: "johndoe@gmail.com",
        username: CASHIER_PROFILE.name,
        role: CASHIER_PROFILE.role,
        status: "Active",
        avatar: CASHIER_PROFILE.image,
      }}
    />
  );
};

export default KasirSettingsPage;
