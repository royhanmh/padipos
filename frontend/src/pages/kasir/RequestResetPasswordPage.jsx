import { Link } from "react-router";
import AuthPageShell from "../../components/AuthPageShell";
import DefaultInputComponent from "../../components/DefaultInputComponent";
import LoginCardComponent from "../../components/LoginCardComponent";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";

const RequestResetPasswordPage = () => {
  return (
    <AuthPageShell>
      <LoginCardComponent
        title="Reset Password"
        subtitle="Please enter your registered email here!"
        className="pb-20 md:pb-24"
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
