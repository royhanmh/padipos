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
  helpTextClassName = "text-[5px] text-gray-400 mt-1",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label htmlFor={id} className="mb-1 text-gray-600 text-sm">
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
          text-sm
            w-full
            px-3
            py-2
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
            pr-10
          "
          {...rest}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <AiOutlineEye className="h-5 w-5" />
            ) : (
              <AiOutlineEyeInvisible className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {helpText && <p className={helpTextClassName}>{helpText}</p>}
    </div>
  );
};

export default DefaultInputComponent;
