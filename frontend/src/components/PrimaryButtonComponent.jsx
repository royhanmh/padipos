const PrimaryButtonComponent = ({
  children = "Sign In",
  type = "button",
  className = "",
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`w-full rounded-xl px-4 py-2.5 text-white font-medium transition duration-200 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#3572EF] focus:ring-offset-1 ${className}`}
      style={{ backgroundColor: "#3572EF" }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default PrimaryButtonComponent;
