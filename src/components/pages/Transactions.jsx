import React, { useEffect, useState } from "react";
import { transactionService } from "@/services/api/transactionService";
import { categoryService } from "@/services/api/categoryService";
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import TransactionModal from "@/components/organisms/TransactionModal";
import CategoryModal from "@/components/organisms/CategoryModal";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import TransactionItem from "@/components/molecules/TransactionItem";
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
// Modal states
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  // Filter states
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    searchTerm: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [transactionsData, categoriesData] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll(),
      ]);
      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load transactions");
      console.error("Transactions loading error:", err);
    } finally {
      setLoading(false);
    }
};

const handleSaveCategory = async (categoryData) => {
    try {
      await categoryService.create(categoryData);
      toast.success("Category created successfully!");
      // Reload categories to update transaction modal options
      await loadData();
    } catch (error) {
      toast.error(error.message || "Failed to create category");
      throw error;
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    // Filter by date range
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter(t => new Date(t.date) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(t => new Date(t.date) <= endDate);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm) ||
        t.category.toLowerCase().includes(searchTerm) ||
        (t.notes && t.notes.toLowerCase().includes(searchTerm))
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredTransactions(filtered);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      category: "",
      startDate: "",
      endDate: "",
      searchTerm: "",
    });
  };

  const setCurrentMonthFilter = () => {
    const now = new Date();
    const startDate = format(startOfMonth(now), "yyyy-MM-dd");
    const endDate = format(endOfMonth(now), "yyyy-MM-dd");
    
    setFilters(prev => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  const handleAddTransaction = async (transactionData) => {
    await transactionService.create(transactionData);
    await loadData();
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setModalMode("edit");
    setShowTransactionModal(true);
  };

  const handleUpdateTransaction = async (transactionData) => {
    await transactionService.update(editingTransaction.Id, transactionData);
    await loadData();
  };

  const handleDeleteTransaction = async (transaction) => {
    if (window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) {
      try {
        await transactionService.delete(transaction.Id);
        await loadData();
        toast.success("Transaction deleted successfully");
      } catch (error) {
        console.error("Failed to delete transaction:", error);
        toast.error("Failed to delete transaction");
      }
    }
  };

const closeModal = () => {
    setShowTransactionModal(false);
    setEditingTransaction(null);
    setModalMode("add");
  };

  const openManageCategoriesModal = () => {
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
  };

  // Calculate totals for filtered transactions
  const calculateTotals = () => {
    const income = filteredTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, balance: income - expenses };
  };

  if (loading) {
    return <Loading type="table" />;
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

  const totals = calculateTotals();
  const hasActiveFilters = Object.values(filters).some(value => value !== "");

return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Transactions
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage all your financial transactions
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
          <Button 
            variant="outline"
            onClick={openManageCategoriesModal}
          >
            <ApperIcon name="FolderPlus" size={16} />
            Manage Categories
          </Button>
          <Button
            variant="primary" 
            size="lg"
            onClick={() => {
              setModalMode("add");
              setShowTransactionModal(true);
            }}
            className="mt-4 sm:mt-0"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* All Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              All Transactions
            </h2>
            <Badge variant="default" size="sm">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""}
            </Badge>
            {hasActiveFilters && (
              <Badge variant="primary" size="sm">
                Filtered
              </Badge>
            )}
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <Empty 
            type="transactions"
            title={hasActiveFilters ? "No matching transactions" : "No transactions yet"}
            description={
              hasActiveFilters 
                ? "Try adjusting your filters to see more transactions."
                : "Start tracking your finances by adding your first transaction."
            }
            actionText="Add Transaction"
            onAction={() => {
              setModalMode("add");
              setShowTransactionModal(true);
            }}
            showAction={!hasActiveFilters}
          />
        ) : (
          <div className="divide-y divide-gray-100 -mx-6">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.Id} className="px-6">
                <TransactionItem 
                  transaction={transaction} 
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                  showActions={true}
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">
              Filter Transactions
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={setCurrentMonthFilter}
              >
                <ApperIcon name="Calendar" size={14} className="mr-2" />
                This Month
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
                  <ApperIcon name="X" size={14} className="mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <ApperIcon name="Search" size={16} className="absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              placeholder="All Types"
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>

            <Select
              placeholder="All Categories"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.Id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Select>

            <Input
              type="date"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />

            <Input
              type="date"
              placeholder="End Date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Summary */}
      {filteredTransactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <div className="text-sm text-gray-600 mb-1">Total Income</div>
            <div className="text-2xl font-bold text-success">
              ${totals.income.toLocaleString()}
            </div>
          </Card>
          <Card className="text-center">
            <div className="text-sm text-gray-600 mb-1">Total Expenses</div>
            <div className="text-2xl font-bold text-error">
              ${totals.expenses.toLocaleString()}
            </div>
          </Card>
          <Card className="text-center">
            <div className="text-sm text-gray-600 mb-1">Net Balance</div>
            <div className={`text-2xl font-bold ${
              totals.balance >= 0 ? "text-success" : "text-error"
            }`}>
              ${totals.balance.toLocaleString()}
            </div>
          </Card>
        </div>
      )}

      <TransactionModal
        isOpen={showTransactionModal}
        onClose={closeModal}
        onSubmit={modalMode === "edit" ? handleUpdateTransaction : handleAddTransaction}
        transaction={editingTransaction}
        mode={modalMode}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={closeCategoryModal}
        onSubmit={handleSaveCategory}
        mode="add"
      />
    </div>
  );
};

export default Transactions;