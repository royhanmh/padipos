import { PiBasketLight, PiGearSixLight, PiReceiptLight } from "react-icons/pi";
import CashierOrderArchiveControl from "../../features/cashier-order-archive/components/CashierOrderArchiveControl";
import SettingsView from "../../features/settings/components/SettingsView";
import { useAuthStore } from "../../stores/authStore";

const DEFAULT_AVATAR = "/images/UserImage.png";

const KasirSettingsPage = () => {
  const user = useAuthStore((state) => state.user);

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
        beforeProfile: <CashierOrderArchiveControl />,
      }}
      accountDefaults={{
        email: user?.email,
        username: user?.username,
        role: "Cashier",
        status: "Active",
        avatar: user?.image_profile || DEFAULT_AVATAR,
      }}
    />
  );
};

export default KasirSettingsPage;
