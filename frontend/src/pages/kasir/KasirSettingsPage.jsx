import { PiBasketLight, PiGearSixLight, PiReceiptLight } from "react-icons/pi";
import CashierOrderArchiveControl from "../../features/cashier-order-archive/components/CashierOrderArchiveControl";
import SettingsView from "../../features/settings/components/SettingsView";
import { useAuthStore } from "../../stores/authStore";
import DocumentTitle from "../../components/DocumentTitle";

const DEFAULT_AVATAR = "/images/UserImage.png";
const formatStatus = (status) => (status === "nonactive" ? "Inactive" : "Active");

const KasirSettingsPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <DocumentTitle title="Pengaturan Kasir" />
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
        status: formatStatus(user?.status),
        avatar: user?.image_profile || DEFAULT_AVATAR,
      }}
    />
    </>
  );
};

export default KasirSettingsPage;
