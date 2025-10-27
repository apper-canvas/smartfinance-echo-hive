import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { categoryService } from "@/services/api/categoryService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const BudgetModal = ({ isOpen, onClose, onSubmit, budget = null, mode = "add" }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    month: format(new Date(), "yyyy-MM"),
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        // Only show expense categories for budgets
        setCategories(data.filter(cat => cat.type === "expense"));
      } catch (error) {
        console.error("Failed to load categories:", error);
        toast.error("Failed to load categories");
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  // Set form data when budget prop changes
  useEffect(() => {
    if (budget && mode === "edit") {
      setFormData({
        categoryId: budget.categoryId,
        amount: budget.amount.toString(),
        month: budget.month,
      });
    } else {
      setFormData({
        categoryId: "",
        amount: "",
        month: format(new Date(), "yyyy-MM"),
      });
    }
    setErrors({});
  }, [budget, mode, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Budget amount must be greater than 0";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (!formData.month) {
      newErrors.month = "Month is required";
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
      const budgetData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (mode === "edit" && budget) {
        budgetData.Id = budget.Id;
      }

      await onSubmit(budgetData);
      onClose();
      toast.success(`Budget ${mode === "edit" ? "updated" : "created"} successfully`);
    } catch (error) {
      console.error("Failed to save budget:", error);
      toast.error(`Failed to ${mode} budget`);
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

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.Id.toString() === categoryId);
    return category ? category.name : "";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-card shadow-card-hover max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "edit" ? "Edit Budget" : "Set New Budget"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Select
            label="Category"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            error={errors.categoryId}
            required
            placeholder="Select a category"
          >
            {categories.map((category) => (
              <option key={category.Id} value={category.Id}>
                {category.name}
              </option>
            ))}
          </Select>

          <Input
            label="Budget Amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleInputChange}
            error={errors.amount}
            required
          />

          <Input
            label="Month"
            name="month"
            type="month"
            value={formData.month}
            onChange={handleInputChange}
            error={errors.month}
            required
          />

          {formData.categoryId && formData.amount && (
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <ApperIcon name="Info" size={16} className="text-primary-600" />
                <span className="text-sm font-medium text-primary-800">Budget Summary</span>
              </div>
              <p className="text-sm text-primary-700">
                You'll set a budget of <span className="font-semibold">
                  ${parseFloat(formData.amount || 0).toFixed(2)}
                </span> for{" "}
                <span className="font-semibold">{getCategoryName(formData.categoryId)}</span> in{" "}
                <span className="font-semibold">
                  {format(new Date(formData.month + "-01"), "MMMM yyyy")}
                </span>.
              </p>
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
                  {mode === "edit" ? "Update" : "Set"} Budget
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;