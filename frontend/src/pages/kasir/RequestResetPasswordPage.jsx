import { Link } from "react-router";
import AuthPageShell from "../../components/AuthPageShell";
import DefaultInputComponent from "../../components/DefaultInputComponent";
import LoginCardComponent from "../../components/LoginCardComponent";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { useAuthStore } from "../../stores/authStore";
import DocumentTitle from "../../components/DocumentTitle";

const RequestResetPasswordPage = () => {
  return (
    <AuthPageShell>
      <DocumentTitle title="Request Reset Password" />
      <LoginCardComponent
        title="Reset Password"
        subtitle="Please enter your registered email here!"
        className="pb-24 max-lg:pb-20"
      >
        <DefaultInputComponent type="email" placeholder="Email" label="Email" />
        <Link to="/reset/form">
          <PrimaryButtonComponent type="submit" className="mt-3">
            Submit
          </PrimaryButtonComponent>
        </Link>
      </LoginCardComponent>
    </AuthPageShell>
  );
};

export default RequestResetPasswordPage;
