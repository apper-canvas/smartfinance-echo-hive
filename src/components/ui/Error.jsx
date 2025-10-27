import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  showRetry = true,
  type = "default" 
}) => {
  const getErrorContent = () => {
    switch (type) {
      case "network":
        return {
          icon: "WifiOff",
          title: "Connection Error",
          description: "Unable to connect to the server. Please check your internet connection and try again.",
        };
      case "data":
        return {
          icon: "Database",
          title: "Data Error",
          description: message || "Unable to load your financial data. Please try again.",
        };
      case "chart":
        return {
          icon: "BarChart3",
          title: "Chart Error",
          description: "Unable to load chart data. Please try again.",
        };
      default:
        return {
          icon: "AlertTriangle",
          title: "Error",
          description: message,
        };
    }
  };

  const { icon, title, description } = getErrorContent();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-card shadow-card min-h-[300px]">
      <div className="w-16 h-16 mb-4 bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center">
        <ApperIcon 
          name={icon} 
          size={32} 
          className="text-error" 
        />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-gray-600 text-center mb-6 max-w-md">
        {description}
      </p>
      
      {showRetry && onRetry && (
        <Button 
          onClick={onRetry}
          variant="primary"
          size="sm"
          className="flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};

export default Error;