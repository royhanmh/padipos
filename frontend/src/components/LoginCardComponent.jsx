const LoginCardComponent = ({
  logoSrc = "/images/BlueRoundLogo.png",
  logoAlt = "Logo",
  title = "Welcome Back!",
  subtitle = "Please enter your username and password here!",
  className = "",
  children,
}) => {
  return (
    <div
      className={`bg-white px-14 pb-10 w-120 rounded-3xl shadow-lg ml-16 ${className}`}
    >
      <div className="text-center">
        <img
          className="mx-auto w-32 h-32 object-contain"
          src={logoSrc}
          alt={logoAlt}
        />
        <h1 className="text-3xl text-black-500 font-semibold mb-2">{title}</h1>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>
      <div className="mt-12 px-5">{children}</div>
    </div>
  );
};

export default LoginCardComponent;
