import SidebarLayout from "./SidebarLayout";
import TopbarLayout from "./TopbarLayout";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <div className="grid h-screen grid-cols-[88px_1fr] grid-rows-[80px_1fr]">
        <SidebarLayout />
        <TopbarLayout />
        <div className="overflow-auto bg-[#F7F7F7]">{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
