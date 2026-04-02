const PrimaryButtonComponent = ({
  children = "Sign In",
  type = "button",
  className = "",
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`flex h-12 w-full items-center justify-center rounded-[10px] px-6 text-base font-medium text-white transition duration-200 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#3572EF] focus:ring-offset-1 md:h-13 ${className}`}
      style={{ backgroundColor: "#3572EF" }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default PrimaryButtonComponent;
