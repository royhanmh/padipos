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
  helpTextClassName = "mt-1.5 text-xs text-gray-400 md:mt-2 md:text-sm",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="mb-5 flex flex-col">
      {label && (
        <label htmlFor={id} className="mb-1.5 text-sm text-gray-600 md:text-base">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="
          min-h-11
          text-sm
            w-full
            px-3.5
            py-2.5
            border
            border-gray-300
            rounded-xl
            placeholder-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400
            focus:border-transparent
            transition
            duration-200
            pr-11
            md:min-h-12
            md:px-4
            md:py-3
            md:pr-12
            md:text-base
          "
          {...rest}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 focus:outline-none md:right-4"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <AiOutlineEye className="h-5 w-5 md:h-6 md:w-6" />
            ) : (
              <AiOutlineEyeInvisible className="h-5 w-5 md:h-6 md:w-6" />
            )}
          </button>
        )}
      </div>
      {helpText && <p className={helpTextClassName}>{helpText}</p>}
    </div>
  );
};

export default DefaultInputComponent;
