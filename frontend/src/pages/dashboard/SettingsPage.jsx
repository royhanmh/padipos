import SettingsView from "../../features/settings/components/SettingsView";

const SettingsPage = () => {
  return (
    <SettingsView
      layoutSidebarProps={{ activeItem: "settings" }}
      accountDefaults={{
        email: "johndoe@gmail.com",
        username: "John Doe",
        role: "Admin",
        status: "Active",
        avatar: "/images/UserImage.png",
      }}
    />
  );
};

export default SettingsPage;
