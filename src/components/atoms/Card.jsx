import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children, 
  variant = "default",
  hover = false,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white shadow-card border-0",
    gradient: "bg-gradient-to-br from-white to-gray-50 shadow-card border-0",
    glass: "glass shadow-card",
  };

  return (
    <div
      className={cn(
        "rounded-card p-6 transition-all duration-200",
        variants[variant],
        hover && "hover:shadow-card-hover hover:-translate-y-1 cursor-pointer",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;