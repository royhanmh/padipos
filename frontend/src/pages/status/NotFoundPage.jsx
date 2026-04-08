import { PiMagnifyingGlassLight } from "react-icons/pi";
import SystemStatePage from "../../components/SystemStatePage";

const NotFoundPage = () => {
  return (
    <SystemStatePage
      tone="brand"
      icon={PiMagnifyingGlassLight}
      title="Page Not Found"
      subtitle="Sorry, the page you are looking for does not exist or has been moved."
      primaryAction={{
        label: "Back to Home",
        to: "/",
      }}
      secondaryAction={{
        label: "Go Back",
        onClick: () => window.history.back(),
      }}
    />
  );
};

export default NotFoundPage;
