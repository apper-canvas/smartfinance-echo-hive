import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { categoryService } from "@/services/api/categoryService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const TransactionModal = ({ isOpen, onClose, onSubmit, transaction = null, mode = "add" }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
        toast.error("Failed to load categories");
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  // Set form data when transaction prop changes
  useEffect(() => {
    if (transaction && mode === "edit") {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        description: transaction.description,
        date: format(new Date(transaction.date), "yyyy-MM-dd"),
        notes: transaction.notes || "",
      });
    } else {
      setFormData({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: format(new Date(), "yyyy-MM-dd"),
        notes: "",
      });
    }
    setErrors({});
  }, [transaction, mode, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
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
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
      };

      if (mode === "edit" && transaction) {
        transactionData.Id = transaction.Id;
      }

      await onSubmit(transactionData);
      onClose();
      toast.success(`Transaction ${mode === "edit" ? "updated" : "added"} successfully`);
    } catch (error) {
      console.error("Failed to save transaction:", error);
      toast.error(`Failed to ${mode} transaction`);
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

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-card shadow-card-hover max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "edit" ? "Edit Transaction" : "Add New Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="text-error">*</span>
              </label>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: "income", category: "" }))}
                  className={`flex-1 py-2.5 px-4 text-sm font-medium transition-colors duration-200 ${
                    formData.type === "income"
                      ? "bg-gradient-to-r from-success to-green-600 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ApperIcon name="TrendingUp" size={16} className="inline mr-2" />
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: "expense", category: "" }))}
                  className={`flex-1 py-2.5 px-4 text-sm font-medium transition-colors duration-200 ${
                    formData.type === "expense"
                      ? "bg-gradient-to-r from-error to-red-600 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ApperIcon name="TrendingDown" size={16} className="inline mr-2" />
                  Expense
                </button>
              </div>
            </div>

            <Input
              label="Amount"
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
          </div>

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            error={errors.category}
            required
            placeholder="Select a category"
          >
            {filteredCategories.map((category) => (
              <option key={category.Id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>

          <Input
            label="Description"
            name="description"
            placeholder="Enter transaction description"
            value={formData.description}
            onChange={handleInputChange}
            error={errors.description}
            required
          />

          <Input
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            error={errors.date}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              rows="3"
              placeholder="Add any additional notes (optional)"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

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
                  {mode === "edit" ? "Update" : "Add"} Transaction
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;