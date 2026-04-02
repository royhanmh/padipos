import { Link } from "react-router";
import DefaultInputComponent from "../../components/DefaultInputComponent";
import LoginCardComponent from "../../components/LoginCardComponent";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";

const RequestResetPasswordPage = () => {
  return (
    <>
      <div
        className="bg-cover bg-center min-h-screen flex items-center"
        style={{ backgroundImage: "url('/images/background.png')" }}
      >
        <LoginCardComponent
          title="Reset Password"
          subtitle="Please enter your registered email here!"
          className="pb-20 md:pb-24"
        >
          <DefaultInputComponent
            type="email"
            placeholder="Email"
            label="Email"
          />
          <Link to="/reset/form">
            <PrimaryButtonComponent type="submit" className="mt-3">
              Submit
            </PrimaryButtonComponent>
          </Link>
        </LoginCardComponent>
      </div>
    </>
  );
};

export default RequestResetPasswordPage;
