import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled = false,
  ...props 
}, ref) => {
  const variants = {
    primary: "btn-primary text-white font-medium shadow-card hover:shadow-card-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
    secondary: "btn-secondary text-primary-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
    outline: "border-2 border-primary-600 text-primary-600 font-medium hover:bg-primary-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
    ghost: "text-primary-600 font-medium hover:bg-primary-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
    danger: "bg-gradient-to-r from-error to-red-600 text-white font-medium shadow-card hover:shadow-card-hover hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;