import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { getLoginPathForRole, useAuthStore } from "../stores/authStore";
import SidebarLayout from "./SidebarLayout";
import TopbarLayout from "./TopbarLayout";

const DEFAULT_PROFILE_IMAGE = "/images/UserImage.png";

const DashboardLayout = ({
  children,
  sidebarProps,
  topbarProps,
  contentClassName = "overflow-auto bg-[#F7F7F7]",
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      logout: state.logout,
    })),
  );

  const handleSignOut = () => {
    const currentRole = user?.role ?? "cashier";
    logout();
    navigate(getLoginPathForRole(currentRole), { replace: true });
  };

  const derivedProfile = {
    name: user?.username ?? "John Doe",
    role: user?.role === "cashier" ? "Cashier" : "Admin",
    image: user?.image_profile || DEFAULT_PROFILE_IMAGE,
  };

  return (
    <div className="grid h-screen grid-cols-[96px_minmax(0,1fr)] grid-rows-[auto_1fr]">
      <SidebarLayout {...sidebarProps} />
      <TopbarLayout
        {...topbarProps}
        profile={topbarProps?.profile ?? derivedProfile}
        onSignOut={topbarProps?.onSignOut ?? handleSignOut}
      />
      <div className={contentClassName}>{children}</div>
    </div>
  );
};

export default DashboardLayout;
