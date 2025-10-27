import React from "react";
import { cn } from "@/utils/cn";

const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  size = "md",
  variant = "primary",
  className,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variants = {
    primary: "from-primary-500 to-secondary-500",
    success: "from-success to-green-600",
    warning: "from-warning to-yellow-600",
    error: "from-error to-red-600",
  };

  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const getVariantByPercentage = () => {
    if (percentage >= 100) return "error";
    if (percentage >= 80) return "warning";
    return "primary";
  };

  const currentVariant = variant === "auto" ? getVariantByPercentage() : variant;

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-600">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      
      <div className="w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            "bg-gradient-to-r transition-all duration-500 ease-out rounded-full",
            variants[currentVariant],
            sizes[size]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;