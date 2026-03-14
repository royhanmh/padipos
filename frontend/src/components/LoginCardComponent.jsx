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
      className={`bg-white w-full max-w-md mx-auto px-6 sm:px-10 pb-10 rounded-3xl shadow-lg md:ml-16 ${className}`}
    >
      <div className="text-center">
        <img
          className="mx-auto w-24 h-24 sm:w-32 sm:h-32 object-contain"
          src={logoSrc}
          alt={logoAlt}
        />
        <h1 className="text-2xl sm:text-3xl text-black font-semibold mb-2">
          {title}
        </h1>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>

      <div className="mt-8 sm:mt-12 px-2 sm:px-5">{children}</div>
    </div>
  );
};

export default LoginCardComponent;
