const PrimaryButtonComponent = ({
  children = "Sign In",
  type = "button",
  className = "",
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`min-h-11 w-full rounded-xl px-5 py-3 text-sm font-medium text-white transition duration-200 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#3572EF] focus:ring-offset-1 md:min-h-12 md:px-6 md:py-3.5 md:text-base ${className}`}
      style={{ backgroundColor: "#3572EF" }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default PrimaryButtonComponent;
