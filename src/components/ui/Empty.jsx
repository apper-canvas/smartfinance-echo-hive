import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  type = "default",
  title,
  description,
  actionText,
  onAction,
  showAction = true 
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "transactions":
        return {
          icon: "Receipt",
          title: title || "No transactions yet",
          description: description || "Start tracking your finances by adding your first income or expense transaction.",
          actionText: actionText || "Add Transaction",
          gradient: "from-primary-500 to-secondary-500",
        };
      case "budgets":
        return {
          icon: "PiggyBank",
          title: title || "No budgets set",
          description: description || "Create your first budget to keep track of your spending and stay on top of your finances.",
          actionText: actionText || "Set Budget",
          gradient: "from-accent-500 to-warning",
        };
      case "goals":
        return {
          icon: "Target",
          title: title || "No savings goals",
          description: description || "Set your first savings goal and watch your progress as you work towards financial freedom.",
          actionText: actionText || "Create Goal",
          gradient: "from-success to-primary-500",
        };
      case "reports":
        return {
          icon: "TrendingUp",
          title: title || "No data to display",
          description: description || "Add some transactions to see beautiful charts and insights about your spending patterns.",
          actionText: actionText || "Add Transaction",
          gradient: "from-info to-secondary-500",
        };
      default:
        return {
          icon: "FileText",
          title: title || "Nothing to show",
          description: description || "There's no data available at the moment.",
          actionText: actionText || "Get Started",
          gradient: "from-primary-500 to-secondary-500",
        };
    }
  };

  const { icon, title: emptyTitle, description: emptyDescription, actionText: emptyActionText, gradient } = getEmptyContent();

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-card shadow-card min-h-[400px]">
      <div className={`w-20 h-20 mb-6 bg-gradient-to-br ${gradient} opacity-10 rounded-full flex items-center justify-center`}>
        <ApperIcon 
          name={icon} 
          size={40} 
          className={`bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {emptyTitle}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
        {emptyDescription}
      </p>
      
      {showAction && onAction && (
        <Button 
          onClick={onAction}
          variant="primary"
          size="lg"
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>{emptyActionText}</span>
        </Button>
      )}
    </div>
  );
};

export default Empty;