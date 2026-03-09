import DefaultInputComponent from "../../components/DefaultInputComponent";
import LoginCardComponent from "../../components/LoginCardComponent";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
const ResetPasswordPage = () => {
  return (
    <>
      <div
        className="bg-cover bg-center min-h-screen flex items-center"
        style={{ backgroundImage: "url('/images/background.png')" }}
      >
        <LoginCardComponent
          title="Reset Password"
          subtitle="Please enter your new password and confirm!"
          className="pb-20"
        >
          <DefaultInputComponent
            type="password"
            label="Password"
            placeholder="Password"
          />
          <DefaultInputComponent
            type="password"
            label="Confirm Password"
            placeholder="Confirm Password"
          />
          <PrimaryButtonComponent type="submit" className="mt-2">
            Reset Password
          </PrimaryButtonComponent>
        </LoginCardComponent>
      </div>
    </>
  );
};

export default ResetPasswordPage;
