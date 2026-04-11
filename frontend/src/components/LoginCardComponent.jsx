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
      className={`mx-auto w-full max-w-155 rounded-[10px] bg-white px-12 pb-14 shadow-[0_22px_60px_rgba(17,24,39,0.2)] lg:ml-20 max-lg:px-7 max-lg:pb-12 xl:scale-75 ${className}`}
    >
      <div className="text-center">
        <img
          className="mx-auto h-36 w-36 object-contain max-lg:h-28 max-lg:w-28"
          src={logoSrc}
          alt={logoAlt}
        />
        <h1 className="mb-2.5 text-4xl font-semibold text-[#2B2B2B] max-lg:text-3xl">
          {title}
        </h1>
        <p className="text-[17px] text-[#919191] max-lg:text-base">{subtitle}</p>
      </div>

      <div className="mt-14 px-6 max-lg:mt-9 max-lg:px-3">
        {children}
      </div>
    </div>
  );
};

export default LoginCardComponent;
