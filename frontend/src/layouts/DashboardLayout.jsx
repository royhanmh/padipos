import SidebarLayout from "./SidebarLayout";
import TopbarLayout from "./TopbarLayout";

const DashboardLayout = ({
  children,
  sidebarProps,
  topbarProps,
  contentClassName = "overflow-auto bg-[#F7F7F7]",
}) => {
  return (
    <>
      <div className="grid h-screen grid-cols-[96px_minmax(0,1fr)] grid-rows-[auto_1fr]">
        <SidebarLayout {...sidebarProps} />
        <TopbarLayout {...topbarProps} />
        <div className={contentClassName}>{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
