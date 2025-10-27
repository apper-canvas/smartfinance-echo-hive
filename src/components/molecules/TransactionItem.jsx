import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const TransactionItem = ({ transaction, onEdit, onDelete, showActions = true }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Food & Dining": "text-orange-600 bg-orange-100",
      "Transportation": "text-blue-600 bg-blue-100",
      "Shopping": "text-purple-600 bg-purple-100",
      "Bills & Utilities": "text-red-600 bg-red-100",
      "Healthcare": "text-pink-600 bg-pink-100",
      "Entertainment": "text-indigo-600 bg-indigo-100",
      "Salary": "text-green-600 bg-green-100",
      "Freelance": "text-teal-600 bg-teal-100",
      "Investment": "text-emerald-600 bg-emerald-100",
      "Other": "text-gray-600 bg-gray-100",
    };
    return colors[category] || "text-gray-600 bg-gray-100";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Food & Dining": "Utensils",
      "Transportation": "Car",
      "Shopping": "ShoppingBag",
      "Bills & Utilities": "Receipt",
      "Healthcare": "Heart",
      "Entertainment": "Film",
      "Salary": "Briefcase",
      "Freelance": "Laptop",
      "Investment": "TrendingUp",
      "Other": "Circle",
    };
    return icons[category] || "Circle";
  };

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-white border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-center space-x-4 flex-1">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(transaction.category)}`}>
          <ApperIcon name={getCategoryIcon(transaction.category)} size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {transaction.description}
            </p>
            <Badge 
              variant={transaction.type === "income" ? "success" : "default"} 
              size="sm"
            >
              {transaction.type}
            </Badge>
          </div>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span>{transaction.category}</span>
            <span>•</span>
            <span>{format(new Date(transaction.date), "MMM dd, yyyy")}</span>
            {transaction.notes && (
              <>
                <span>•</span>
                <span className="truncate max-w-[200px]">{transaction.notes}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className={`text-lg font-semibold ${
            transaction.type === "income" ? "text-success" : "text-gray-900"
          }`}>
            {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
          </p>
        </div>

        {showActions && (
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(transaction)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                title="Edit transaction"
              >
                <ApperIcon name="Edit2" size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(transaction)}
                className="p-2 text-gray-400 hover:text-error hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Delete transaction"
              >
                <ApperIcon name="Trash2" size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;