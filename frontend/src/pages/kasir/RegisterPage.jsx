import { Link } from "react-router";
import AuthPageShell from "../../components/AuthPageShell";
import DefaultInputComponent from "../../components/DefaultInputComponent";
import LoginCardComponent from "../../components/LoginCardComponent";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";

const RegisterPage = () => {
  return (
    <AuthPageShell>
      <LoginCardComponent subtitle="Create Your Account Here">
        <DefaultInputComponent
          type="text"
          label="Username"
          placeholder="Username"
        />
        <DefaultInputComponent
          type="email"
          label="Email"
          placeholder="Email"
        />
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
          Create Account
        </PrimaryButtonComponent>
        <p className="mt-5 pb-6 text-center text-base text-[#919191] md:text-[17px]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#3572EF] hover:text-[#1255DE]">
            Login
          </Link>
        </p>
      </LoginCardComponent>
    </AuthPageShell>
  );
};

export default RegisterPage;
