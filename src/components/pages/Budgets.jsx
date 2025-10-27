import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ProgressBar from "@/components/molecules/ProgressBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import BudgetModal from "@/components/organisms/BudgetModal";
import ApperIcon from "@/components/ApperIcon";
import { budgetService } from "@/services/api/budgetService";
import { transactionService } from "@/services/api/transactionService";
import { categoryService } from "@/services/api/categoryService";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "react-toastify";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  
  // Current month for display
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [budgetsData, transactionsData, categoriesData] = await Promise.all([
        budgetService.getAll(),
        transactionService.getAll(),
        categoryService.getAll(),
      ]);
      setBudgets(budgetsData);
      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load budget data");
      console.error("Budgets loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate spending for each budget
  const calculateBudgetSpending = (budget) => {
    const budgetDate = new Date(budget.month + "-01");
    const monthStart = startOfMonth(budgetDate);
    const monthEnd = endOfMonth(budgetDate);
    
    // Find category by ID
    const category = categories.find(cat => cat.Id === parseInt(budget.categoryId));
    if (!category) return 0;

    const spent = transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transaction.type === "expense" &&
          transaction.category === category.name &&
          transactionDate >= monthStart &&
          transactionDate <= monthEnd
        );
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return spent;
  };

  // Get budgets for selected month with spending data
  const getCurrentMonthBudgets = () => {
    return budgets
      .filter(budget => budget.month === selectedMonth)
      .map(budget => ({
        ...budget,
        spent: calculateBudgetSpending(budget),
      }))
      .sort((a, b) => {
        // Sort by category name
        const categoryA = categories.find(cat => cat.Id === parseInt(a.categoryId))?.name || "";
        const categoryB = categories.find(cat => cat.Id === parseInt(b.categoryId))?.name || "";
        return categoryA.localeCompare(categoryB);
      });
  };

  // Calculate overall budget summary
  const getBudgetSummary = () => {
    const monthBudgets = getCurrentMonthBudgets();
    const totalBudgeted = monthBudgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = monthBudgets.reduce((sum, budget) => sum + budget.spent, 0);
    const remaining = totalBudgeted - totalSpent;
    const progress = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

    return {
      totalBudgeted,
      totalSpent,
      remaining,
      progress,
      budgetCount: monthBudgets.length,
      overBudget: monthBudgets.filter(budget => budget.spent > budget.amount).length,
    };
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.Id === parseInt(categoryId));
    return category ? category.name : "Unknown Category";
  };

  const getCategoryIcon = (categoryName) => {
    const icons = {
      "Food & Dining": "Utensils",
      "Transportation": "Car",
      "Shopping": "ShoppingBag",
      "Bills & Utilities": "Receipt",
      "Healthcare": "Heart",
      "Entertainment": "Film",
      "Other": "Circle",
    };
    return icons[categoryName] || "Circle";
  };

  const handleAddBudget = async (budgetData) => {
    await budgetService.create(budgetData);
    await loadData();
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setModalMode("edit");
    setShowBudgetModal(true);
  };

  const handleUpdateBudget = async (budgetData) => {
    await budgetService.update(editingBudget.Id, budgetData);
    await loadData();
  };

  const handleDeleteBudget = async (budget) => {
    if (window.confirm("Are you sure you want to delete this budget? This action cannot be undone.")) {
      try {
        await budgetService.delete(budget.Id);
        await loadData();
        toast.success("Budget deleted successfully");
      } catch (error) {
        console.error("Failed to delete budget:", error);
        toast.error("Failed to delete budget");
      }
    }
  };

  const closeModal = () => {
    setShowBudgetModal(false);
    setEditingBudget(null);
    setModalMode("add");
  };

  const changeMonth = (direction) => {
    const currentDate = new Date(selectedMonth + "-01");
    if (direction === "prev") {
      currentDate.setMonth(currentDate.getMonth() - 1);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    setSelectedMonth(format(currentDate, "yyyy-MM"));
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return (
      <Error 
        type="data" 
        message={error} 
        onRetry={loadData} 
      />
    );
  }

  const currentBudgets = getCurrentMonthBudgets();
  const summary = getBudgetSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Budget Manager
          </h1>
          <p className="text-gray-600 mt-1">
            Set and track your spending limits by category
          </p>
        </div>
        
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => {
            setModalMode("add");
            setShowBudgetModal(true);
          }}
          className="mt-4 sm:mt-0"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Set Budget
        </Button>
      </div>

      {/* Month Navigation */}
      <Card>
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => changeMonth("prev")}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="ChevronLeft" size={16} />
            <span>Previous</span>
          </Button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {format(new Date(selectedMonth + "-01"), "MMMM yyyy")}
          </h2>
          
          <Button 
            variant="ghost" 
            onClick={() => changeMonth("next")}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ApperIcon name="ChevronRight" size={16} />
          </Button>
        </div>
      </Card>

      {/* Budget Summary */}
      {currentBudgets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <div className="text-sm text-gray-600 mb-1">Total Budgeted</div>
            <div className="text-2xl font-bold text-primary-600">
              ${summary.totalBudgeted.toLocaleString()}
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="text-sm text-gray-600 mb-1">Total Spent</div>
            <div className={`text-2xl font-bold ${
              summary.totalSpent > summary.totalBudgeted ? "text-error" : "text-gray-900"
            }`}>
              ${summary.totalSpent.toLocaleString()}
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="text-sm text-gray-600 mb-1">Remaining</div>
            <div className={`text-2xl font-bold ${
              summary.remaining >= 0 ? "text-success" : "text-error"
            }`}>
              ${Math.abs(summary.remaining).toLocaleString()}
              {summary.remaining < 0 && " over"}
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="text-sm text-gray-600 mb-1">Progress</div>
            <div className={`text-2xl font-bold ${
              summary.progress > 100 ? "text-error" : summary.progress > 80 ? "text-warning" : "text-primary-600"
            }`}>
              {summary.progress.toFixed(0)}%
            </div>
            {summary.overBudget > 0 && (
              <div className="text-xs text-error mt-1">
                {summary.overBudget} over budget
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Budget List */}
      {currentBudgets.length === 0 ? (
        <Empty 
          type="budgets"
          title={`No budgets for ${format(new Date(selectedMonth + "-01"), "MMMM yyyy")}`}
          description="Create your first budget to keep track of your spending and stay on top of your finances."
          actionText="Set Budget"
          onAction={() => {
            setModalMode("add");
            setShowBudgetModal(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentBudgets.map((budget) => {
            const categoryName = getCategoryName(budget.categoryId);
            const progress = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
            const remaining = budget.amount - budget.spent;
            const isOverBudget = budget.spent > budget.amount;
            
            return (
              <Card key={budget.Id} className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                      isOverBudget 
                        ? "from-error/10 to-red-100" 
                        : progress > 80 
                        ? "from-warning/10 to-yellow-100"
                        : "from-primary-50 to-secondary-50"
                    } flex items-center justify-center`}>
                      <ApperIcon 
                        name={getCategoryIcon(categoryName)} 
                        size={24} 
                        className={
                          isOverBudget 
                            ? "text-error" 
                            : progress > 80 
                            ? "text-warning"
                            : "text-primary-600"
                        }
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {categoryName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ${budget.amount.toLocaleString()} budgeted
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditBudget(budget)}
                      className="p-2"
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteBudget(budget)}
                      className="p-2 hover:bg-red-50 hover:text-error"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Spent: ${budget.spent.toLocaleString()}</span>
                    <span className={`font-medium ${
                      remaining >= 0 ? "text-success" : "text-error"
                    }`}>
                      {remaining >= 0 ? `$${remaining.toLocaleString()} left` : `$${Math.abs(remaining).toLocaleString()} over`}
                    </span>
                  </div>

                  <ProgressBar
                    value={budget.spent}
                    max={budget.amount}
                    variant="auto"
                    size="md"
                    showPercentage={true}
                  />

                  {isOverBudget && (
                    <div className="flex items-center space-x-2 text-sm text-error bg-red-50 rounded-lg p-3">
                      <ApperIcon name="AlertTriangle" size={16} />
                      <span className="font-medium">Over budget by ${Math.abs(remaining).toLocaleString()}</span>
                    </div>
                  )}

                  {progress > 80 && progress < 100 && (
                    <div className="flex items-center space-x-2 text-sm text-warning bg-yellow-50 rounded-lg p-3">
                      <ApperIcon name="AlertCircle" size={16} />
                      <span className="font-medium">Approaching budget limit</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={showBudgetModal}
        onClose={closeModal}
        onSubmit={modalMode === "edit" ? handleUpdateBudget : handleAddBudget}
        budget={editingBudget}
        mode={modalMode}
      />
    </div>
  );
};

export default Budgets;