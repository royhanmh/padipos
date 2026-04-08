import { PiCloudSlashLight } from "react-icons/pi";
import SystemStatePage from "../../components/SystemStatePage";

const ServerErrorPage = () => {
  return (
    <SystemStatePage
      tone="error"
      icon={PiCloudSlashLight}
      title="Server Error"
      subtitle="There was a temporary error on our server. Please try again in a few moments."
      primaryAction={{
        label: "Try Again",
        onClick: () => window.location.reload(),
      }}
      secondaryAction={{
        label: "Back to Home",
        to: "/",
      }}
    />
  );
};

export default ServerErrorPage;
