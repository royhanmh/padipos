import { PiToolboxLight } from "react-icons/pi";
import DocumentTitle from "../../components/DocumentTitle";
import SystemStatePage from "../../components/SystemStatePage";

const MaintenancePage = () => {
  return (
    <>
      <DocumentTitle title="Pemeliharaan Sistem" />
      <SystemStatePage
        tone="maintenance"
        icon={PiToolboxLight}
        title="Under Maintenance"
        subtitle="Our service is currently undergoing scheduled maintenance to improve our service quality."
        primaryAction={{
          label: "Reload Page",
          onClick: () => window.location.reload(),
        }}
        secondaryAction={{
          label: "Back to Login",
          to: "/login",
        }}
      />
    </>
  );
};

export default MaintenancePage;
