import React from "react";
import PropTypes from "prop-types";

// Tailwind style maps
const variantClasses = {
  primary: "bg-indigo-500 text-white hover:bg-indigo-600",
  secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  outline: "border border-indigo-500 text-indigo-500 bg-white hover:bg-indigo-50",
  danger: "bg-red-500 text-white hover:bg-red-600",
  show: "bg-green-500 text-white hover:bg-green-600",
};



const sizeClasses = {
  small: "px-3 py-1 text-xs",
  medium: "px-4 py-2 text-sm",
  large: "px-6 py-3 text-base",
};

const fullWidthClass = "w-full";
const disabledClass = "opacity-50 cursor-not-allowed";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  as = "button",
  className = "",
  style = {},
  ...props
}) => {
  const Component = as === "a" ? "a" : "button";
  const isDisabled = disabled || loading;

  const classes = [
    "rounded-md font-medium transition-colors duration-150 justify-center",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? fullWidthClass : "",
    isDisabled ? disabledClass : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component
      className={classes}
      disabled={as === "button" ? isDisabled : undefined}
      aria-disabled={isDisabled}
      style={style}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" aria-label="Loading..." />
      ) : (
        <>
          {icon && iconPosition === "left" && <span className="btn-icon mr-2">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === "right" && <span className="btn-icon ml-2">{icon}</span>}
        </>
      )}
    </Component>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "danger"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  as: PropTypes.oneOf(["button", "a"]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Button;