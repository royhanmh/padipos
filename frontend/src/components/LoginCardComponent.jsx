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
      className={`mx-auto w-full max-w-lg rounded-3xl bg-white px-7 pb-12 shadow-lg sm:px-10 md:ml-20 md:px-12 md:pb-14 ${className}`}
    >
      <div className="text-center">
        <img
          className="mx-auto h-28 w-28 object-contain sm:h-32 sm:w-32 md:h-36 md:w-36"
          src={logoSrc}
          alt={logoAlt}
        />
        <h1 className="mb-2.5 text-3xl font-semibold text-black sm:text-3xl md:text-4xl">
          {title}
        </h1>
        <p className="text-base text-gray-400 md:text-[17px]">{subtitle}</p>
      </div>

      <div className="mt-9 px-3 sm:mt-12 sm:px-5 md:mt-14 md:px-6">
        {children}
      </div>
    </div>
  );
};

export default LoginCardComponent;
