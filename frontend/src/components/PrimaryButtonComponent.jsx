const PrimaryButtonComponent = ({
  children = "Sign In",
  type = "button",
  className = "",
  disabled = false,
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`flex h-12 w-full items-center justify-center rounded-[10px] px-6 text-base font-medium text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#3572EF] focus:ring-offset-1 md:h-13 ${
        disabled ? "cursor-not-allowed opacity-70" : "hover:brightness-95"
      } ${className}`}
      style={{ backgroundColor: "#3572EF" }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default PrimaryButtonComponent;
