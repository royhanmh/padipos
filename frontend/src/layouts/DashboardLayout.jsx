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

  const handleSignOut = async () => {
    const currentRole = user?.role ?? "cashier";
    await logout();
    navigate(getLoginPathForRole(currentRole), { replace: true });
  };

  const derivedProfile = {
    name: user?.username ?? "John Doe",
    role: user?.role === "cashier" ? "Cashier" : "Admin",
    image: user?.image_profile || DEFAULT_PROFILE_IMAGE,
  };

  return (
    <div className="grid h-screen min-h-screen overflow-hidden bg-[#F7F7F7] lg:grid-cols-[96px_minmax(0,1fr)] lg:grid-rows-[auto_minmax(0,1fr)]">
      <SidebarLayout {...sidebarProps} />
      <div className="min-w-0 lg:col-start-2 lg:row-start-1">
        <TopbarLayout
          {...topbarProps}
          profile={topbarProps?.profile ?? derivedProfile}
          onSignOut={topbarProps?.onSignOut ?? handleSignOut}
        />
      </div>
      <div
        className={`min-h-0 min-w-0 max-lg:pb-20 lg:col-start-2 lg:row-start-2 ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
