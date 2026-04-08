import AuthPageShell from "../../components/AuthPageShell";
import DefaultInputComponent from "../../components/DefaultInputComponent";
import LoginCardComponent from "../../components/LoginCardComponent";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
const ResetPasswordPage = () => {
  return (
    <AuthPageShell>
      <LoginCardComponent
        title="Reset Password"
        subtitle="Please enter your new password and confirm!"
        className="pb-24 max-lg:pb-20"
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
        <PrimaryButtonComponent type="submit" className="mt-3">
          Reset Password
        </PrimaryButtonComponent>
      </LoginCardComponent>
    </AuthPageShell>
  );
};

export default ResetPasswordPage;
