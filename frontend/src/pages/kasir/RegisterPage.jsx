import { Link } from "react-router";
import DefaultInputComponent from "../../components/DefaultInputComponent";
import LoginCardComponent from "../../components/LoginCardComponent";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";

const RegisterPage = () => {
  return (
    <>
      <div
        className="bg-cover bg-center min-h-screen flex items-center"
        style={{ backgroundImage: "url('/images/background.png')" }}
      >
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

          <PrimaryButtonComponent type="submit" className="mt-2">
            Create Account
          </PrimaryButtonComponent>
          <p className="text-sm text-gray-400 mt-4 text-center pb-5">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-600">
              Login
            </Link>
          </p>
        </LoginCardComponent>
      </div>
    </>
  );
};

export default RegisterPage;
