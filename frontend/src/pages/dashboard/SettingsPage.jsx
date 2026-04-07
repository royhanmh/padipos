import SettingsView from "../../features/settings/components/SettingsView";
import { useAuthStore } from "../../stores/authStore";

const DEFAULT_AVATAR = "/images/UserImage.png";

const SettingsPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <SettingsView
      layoutSidebarProps={{ activeItem: "settings" }}
      accountDefaults={{
        email: user?.email,
        username: user?.username,
        role: "Admin",
        status: "Active",
        avatar: user?.image_profile || DEFAULT_AVATAR,
      }}
    />
  );
};

export default SettingsPage;
