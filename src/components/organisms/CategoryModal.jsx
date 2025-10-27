import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { categoryService } from "@/services/api/categoryService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const CATEGORY_COLORS = [
  { value: "#EF4444", name: "Red" },
  { value: "#F59E0B", name: "Orange" },
  { value: "#EAB308", name: "Yellow" },
  { value: "#22C55E", name: "Green" },
  { value: "#10B981", name: "Emerald" },
  { value: "#14B8A6", name: "Teal" },
  { value: "#06B6D4", name: "Cyan" },
  { value: "#3B82F6", name: "Blue" },
  { value: "#6366F1", name: "Indigo" },
  { value: "#8B5CF6", name: "Violet" },
  { value: "#A855F7", name: "Purple" },
  { value: "#EC4899", name: "Pink" },
];

const CATEGORY_ICONS = [
  "ShoppingCart",
  "Coffee",
  "Utensils",
  "Car",
  "Home",
  "Plane",
  "Heart",
  "Briefcase",
  "GraduationCap",
  "Gift",
  "Music",
  "Dumbbell",
  "Smartphone",
  "TrendingUp",
  "Wallet",
  "Package",
];

const CategoryModal = ({ isOpen, onClose, onSubmit, category = null, mode = "add" }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    color: "#3B82F6",
    icon: "ShoppingCart",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        type: category.type || "",
        color: category.color || "#3B82F6",
        icon: category.icon || "ShoppingCart",
      });
    } else {
      setFormData({
        name: "",
        type: "",
        color: "#3B82F6",
        icon: "ShoppingCart",
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }
    
    if (!formData.type) {
      newErrors.type = "Category type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleColorSelect = (color) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  const handleIconSelect = (icon) => {
    setFormData((prev) => ({ ...prev, icon }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "edit" ? "Edit Category" : "Create New Category"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {mode === "edit" ? "Update category details" : "Add a new category for transactions"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Name */}
          <Input
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Groceries, Salary, Entertainment"
            required
            error={errors.name}
          />

          {/* Category Type */}
          <Select
            label="Category Type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            error={errors.type}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>

          {/* Color Picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Category Color <span className="text-error ml-1">*</span>
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-3">
              {CATEGORY_COLORS.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={() => handleColorSelect(colorOption.value)}
                  className={cn(
                    "w-full aspect-square rounded-lg transition-all hover:scale-110",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2",
                    formData.color === colorOption.value
                      ? "ring-2 ring-offset-2 ring-gray-900 scale-110"
                      : "hover:ring-2 hover:ring-offset-2 hover:ring-gray-400"
                  )}
                  style={{ backgroundColor: colorOption.value }}
                  title={colorOption.name}
                >
                  {formData.color === colorOption.value && (
                    <ApperIcon
                      name="Check"
                      size={16}
                      className="text-white mx-auto"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Category Icon <span className="text-error ml-1">*</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {CATEGORY_ICONS.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => handleIconSelect(iconName)}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all hover:scale-105",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500",
                    formData.icon === iconName
                      ? "border-primary-600 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  title={iconName}
                >
                  <ApperIcon
                    name={iconName}
                    size={24}
                    className={cn(
                      "mx-auto",
                      formData.icon === iconName
                        ? "text-primary-600"
                        : "text-gray-600"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: formData.color }}
              >
                <ApperIcon
                  name={formData.icon}
                  size={24}
                  className="text-white"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {formData.name || "Category Name"}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  {formData.type || "Type"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  Saving...
                </>
              ) : mode === "edit" ? (
                "Update Category"
              ) : (
                "Create Category"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;