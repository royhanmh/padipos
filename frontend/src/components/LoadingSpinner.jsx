import React from "react";

const LoadingSpinner = ({ size = "sm", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };

  return (
    <div
      className={`animate-spin rounded-full border-white/30 border-t-white ${sizeClasses[size] || sizeClasses.sm} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
