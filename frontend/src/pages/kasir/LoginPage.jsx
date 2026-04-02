import { useState } from "react";
import { Link } from "react-router";
import DefaultInputComponent from "../../components/DefaultInputComponent";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import LoginCardComponent from "../../components/LoginCardComponent";

const LoginPage = () => {
  const [password, setPassword] = useState("");

  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center"
      style={{ backgroundImage: "url('/images/background.png')" }}
    >
      <LoginCardComponent>
        <DefaultInputComponent
          type="text"
          placeholder="Username"
          label="Username"
          id="username"
        />
        <DefaultInputComponent
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helpText={
            <Link
              to="/reset"
              className="text-base text-gray-400 hover:text-gray-500 md:text-[17px]"
            >
              Forget password?
            </Link>
          }
          helpTextClassName="mt-2.5 text-right md:mt-3"
        />
        <PrimaryButtonComponent type="submit" className="mt-3">
          Login
        </PrimaryButtonComponent>
        <p className="mt-5 pb-6 text-center text-base text-gray-400 md:text-[17px]">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:text-blue-600">
            Register
          </Link>
        </p>
      </LoginCardComponent>
    </div>
  );
};

export default LoginPage;
