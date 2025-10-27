import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const GoalCard = ({ goal, onEdit, onDelete, onAddFunds, showActions = true }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const isCompleted = progress >= 100;
  
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getProgressColor = () => {
    if (isCompleted) return "#10B981";
    if (progress >= 75) return "#F59E0B";
    return "#0A7E5C";
  };

  return (
    <Card className="relative overflow-hidden" hover={!isCompleted}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{goal.name}</h3>
          <p className="text-sm text-gray-600">
            Target: {formatCurrency(goal.targetAmount)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Due: {format(new Date(goal.deadline), "MMM dd, yyyy")}
          </p>
        </div>

        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={getProgressColor()}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-lg font-bold text-gray-900">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Current:</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatCurrency(goal.currentAmount)}
          </span>
        </div>
        
        {!isCompleted && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Remaining:</span>
            <span className="text-sm font-semibold text-accent-600">
              {formatCurrency(remaining)}
            </span>
          </div>
        )}

        {isCompleted && (
          <div className="flex items-center justify-center py-2 bg-gradient-to-r from-success/10 to-green-100 rounded-lg">
            <ApperIcon name="CheckCircle" size={16} className="text-success mr-2" />
            <span className="text-sm font-medium text-success">Goal Completed!</span>
          </div>
        )}

        {showActions && (
          <div className="flex space-x-2 pt-2">
            {!isCompleted && onAddFunds && (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => onAddFunds(goal)}
                className="flex-1"
              >
                <ApperIcon name="Plus" size={14} className="mr-1" />
                Add Funds
              </Button>
            )}
            
            <div className="flex space-x-1">
              {onEdit && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEdit(goal)}
                  className="p-2"
                >
                  <ApperIcon name="Edit2" size={14} />
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDelete(goal)}
                  className="p-2 hover:bg-red-50 hover:text-error"
                >
                  <ApperIcon name="Trash2" size={14} />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {isCompleted && (
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
            <ApperIcon name="Trophy" size={16} className="text-white" />
          </div>
        </div>
      )}
    </Card>
  );
};

export default GoalCard;