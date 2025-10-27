import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendDirection = "up",
  gradient = "from-primary-500 to-secondary-500",
  className,
  ...props
}) => {
  const formatValue = (val) => {
    if (typeof val === "number") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    }
    return val;
  };

  return (
    <Card className={cn("relative overflow-hidden", className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatValue(value)}
          </p>
          {trend && (
            <div className={cn(
              "flex items-center space-x-1 text-sm font-medium",
              trendDirection === "up" ? "text-success" : "text-error"
            )}>
              <ApperIcon 
                name={trendDirection === "up" ? "TrendingUp" : "TrendingDown"} 
                size={14} 
              />
              <span>{trend}</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "w-12 h-12 rounded-xl bg-gradient-to-br opacity-10 flex items-center justify-center",
          gradient
        )}>
          <ApperIcon 
            name={icon} 
            size={24} 
            className={cn("bg-gradient-to-br bg-clip-text text-transparent", gradient)}
          />
        </div>
      </div>
      
      {/* Decorative gradient overlay */}
      <div className={cn(
        "absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br opacity-5 rounded-full",
        gradient
      )} />
    </Card>
  );
};

export default StatCard;