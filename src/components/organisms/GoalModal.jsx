import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { format, addMonths } from "date-fns";
import { toast } from "react-toastify";

const GoalModal = ({ isOpen, onClose, onSubmit, goal = null, mode = "add" }) => {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: format(addMonths(new Date(), 12), "yyyy-MM-dd"),
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Set form data when goal prop changes
  useEffect(() => {
    if (goal && mode === "edit") {
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        deadline: format(new Date(goal.deadline), "yyyy-MM-dd"),
      });
    } else {
      setFormData({
        name: "",
        targetAmount: "",
        currentAmount: "0",
        deadline: format(addMonths(new Date(), 12), "yyyy-MM-dd"),
      });
    }
    setErrors({});
  }, [goal, mode, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Goal name is required";
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = "Target amount must be greater than 0";
    }

    const currentAmount = parseFloat(formData.currentAmount) || 0;
    const targetAmount = parseFloat(formData.targetAmount) || 0;

    if (currentAmount < 0) {
      newErrors.currentAmount = "Current amount cannot be negative";
    }

    if (currentAmount > targetAmount) {
      newErrors.currentAmount = "Current amount cannot be greater than target amount";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required";
    } else {
      const deadline = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadline < today) {
        newErrors.deadline = "Deadline must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        deadline: new Date(formData.deadline).toISOString(),
      };

      if (mode === "edit" && goal) {
        goalData.Id = goal.Id;
      }

      await onSubmit(goalData);
      onClose();
      toast.success(`Goal ${mode === "edit" ? "updated" : "created"} successfully`);
    } catch (error) {
      console.error("Failed to save goal:", error);
      toast.error(`Failed to ${mode} goal`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const calculateProgress = () => {
    const current = parseFloat(formData.currentAmount) || 0;
    const target = parseFloat(formData.targetAmount) || 1;
    return Math.min((current / target) * 100, 100);
  };

  const getRemainingAmount = () => {
    const current = parseFloat(formData.currentAmount) || 0;
    const target = parseFloat(formData.targetAmount) || 0;
    return Math.max(target - current, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-card shadow-card-hover max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "edit" ? "Edit Savings Goal" : "Create New Savings Goal"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Goal Name"
            name="name"
            placeholder="e.g., Emergency Fund, Vacation, New Car"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target Amount"
              name="targetAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.targetAmount}
              onChange={handleInputChange}
              error={errors.targetAmount}
              required
            />

            <Input
              label="Current Amount"
              name="currentAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.currentAmount}
              onChange={handleInputChange}
              error={errors.currentAmount}
            />
          </div>

          <Input
            label="Target Date"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleInputChange}
            error={errors.deadline}
            required
          />

          {formData.targetAmount && formData.currentAmount !== "" && (
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <ApperIcon name="Target" size={16} className="text-primary-600" />
                <span className="text-sm font-medium text-primary-800">Goal Progress</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">Progress:</span>
                  <span className="font-semibold text-primary-800">
                    {calculateProgress().toFixed(1)}%
                  </span>
                </div>
                
                <div className="w-full bg-primary-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProgress()}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-primary-700">
                  <span>
                    Current: ${parseFloat(formData.currentAmount || 0).toLocaleString()}
                  </span>
                  <span>
                    Remaining: ${getRemainingAmount().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  {mode === "edit" ? "Update" : "Create"} Goal
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;