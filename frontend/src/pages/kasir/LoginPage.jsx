import { useState } from "react";
import { Link } from "react-router";
import AuthPageShell from "../../components/AuthPageShell";
import DefaultInputComponent from "../../components/DefaultInputComponent";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import LoginCardComponent from "../../components/LoginCardComponent";

const LoginPage = () => {
  const [password, setPassword] = useState("");

  return (
    <AuthPageShell>
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
              className="text-base text-[#919191] hover:text-[#5E5E5E] md:text-[17px]"
            >
              Forget password?
            </Link>
          }
          helpTextClassName="mt-2.5 text-right md:mt-3"
        />
        <PrimaryButtonComponent type="submit" className="mt-3">
          Login
        </PrimaryButtonComponent>
        <p className="mt-5 pb-6 text-center text-base text-[#919191] md:text-[17px]">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#3572EF] hover:text-[#1255DE]">
            Register
          </Link>
        </p>
      </LoginCardComponent>
    </AuthPageShell>
  );
};

export default LoginPage;
