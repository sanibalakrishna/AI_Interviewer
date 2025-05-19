import React from "react";

function Button({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded font-semibold transition duration-200
        ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }
        ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
