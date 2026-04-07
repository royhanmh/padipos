import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const DefaultInputComponent = ({
  label,
  type = "text",
  placeholder = "",
  id,
  value,
  onChange,
  helpText,
  error,
  helpTextClassName = "mt-1.5 text-xs text-[#919191] md:mt-2 md:text-sm",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="mb-5 flex flex-col">
      {label ? (
        <label htmlFor={id} className="mb-1.5 text-sm text-[#5E5E5E]">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`h-12 w-full rounded-[10px] border bg-white px-4 pr-11 text-sm text-[#2B2B2B] placeholder:text-[#ABABAB] outline-none transition duration-200 focus:ring-2 md:h-13 md:px-5 md:pr-12 md:text-base ${
            error
              ? "border-[#F04438] focus:border-[#F04438] focus:ring-[#FEE4E2]"
              : "border-[#D7D7D7] focus:border-[#C2D4FA] focus:ring-[#C2D4FA]"
          }`}
          {...rest}
        />
        {type === "password" ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#919191] hover:text-[#3572EF] focus:outline-none md:right-4"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <AiOutlineEye className="h-5 w-5 md:h-6 md:w-6" />
            ) : (
              <AiOutlineEyeInvisible className="h-5 w-5 md:h-6 md:w-6" />
            )}
          </button>
        ) : null}
      </div>
      {error ? <p className="mt-1.5 text-xs text-[#F04438] md:mt-2 md:text-sm">{error}</p> : null}
      {helpText ? <p className={helpTextClassName}>{helpText}</p> : null}
    </div>
  );
};

export default DefaultInputComponent;
