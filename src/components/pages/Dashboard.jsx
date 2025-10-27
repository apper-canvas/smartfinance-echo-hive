import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import TransactionItem from "@/components/molecules/TransactionItem";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import TransactionModal from "@/components/organisms/TransactionModal";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { budgetService } from "@/services/api/budgetService";
import { goalService } from "@/services/api/goalService";
import { format, startOfMonth, endOfMonth } from "date-fns";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const currentMonth = format(new Date(), "yyyy-MM");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [transactionsData, budgetsData, goalsData] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll(),
        goalService.getAll(),
      ]);
      setTransactions(transactionsData);
      setBudgets(budgetsData);
      setGoals(goalsData);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate current month statistics
  const getCurrentMonthStats = () => {
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());
    
    const currentMonthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= currentMonthStart && transactionDate <= currentMonthEnd;
    });

    const income = currentMonthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = currentMonthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    return { income, expenses, balance, transactionCount: currentMonthTransactions.length };
  };

  // Get recent transactions (last 5)
  const getRecentTransactions = () => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  // Calculate total savings progress
  const getTotalSavingsProgress = () => {
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const progress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
    
    return { totalTarget, totalCurrent, progress };
  };

  // Get budget status for current month
  const getBudgetStatus = () => {
    const currentMonthBudgets = budgets.filter(budget => budget.month === currentMonth);
    const totalBudgeted = currentMonthBudgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = currentMonthBudgets.reduce((sum, budget) => sum + (budget.spent || 0), 0);
    const progress = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
    
    return { totalBudgeted, totalSpent, progress };
  };

  const handleAddTransaction = async (transactionData) => {
    await transactionService.create(transactionData);
    await loadDashboardData();
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return (
      <Error 
        type="data" 
        message={error} 
        onRetry={loadDashboardData} 
      />
    );
  }

  const stats = getCurrentMonthStats();
  const recentTransactions = getRecentTransactions();
  const savingsProgress = getTotalSavingsProgress();
  const budgetStatus = getBudgetStatus();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to SmartFinance
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your financial overview for {format(new Date(), "MMMM yyyy")}
          </p>
        </div>
        
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => setShowTransactionModal(true)}
          className="mt-4 sm:mt-0"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={stats.income}
          icon="TrendingUp"
          gradient="from-success to-green-600"
          trend={stats.transactionCount > 0 ? "This month" : undefined}
          trendDirection="up"
        />
        
        <StatCard
          title="Total Expenses"
          value={stats.expenses}
          icon="TrendingDown"
          gradient="from-error to-red-600"
          trend={stats.transactionCount > 0 ? "This month" : undefined}
          trendDirection="down"
        />
        
        <StatCard
          title="Net Balance"
          value={stats.balance}
          icon="DollarSign"
          gradient={stats.balance >= 0 ? "from-primary-500 to-secondary-500" : "from-error to-red-600"}
          trend={stats.balance >= 0 ? "Positive" : "Negative"}
          trendDirection={stats.balance >= 0 ? "up" : "down"}
        />
        
        <StatCard
          title="Savings Progress"
          value={`${savingsProgress.progress.toFixed(0)}%`}
          icon="Target"
          gradient="from-accent-500 to-yellow-600"
          trend={goals.length > 0 ? `${goals.length} goals` : "No goals set"}
          trendDirection="up"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Transactions
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = "/transactions"}
              >
                View All
                <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </div>

            {recentTransactions.length === 0 ? (
              <Empty 
                type="transactions"
                title="No transactions yet"
                description="Start tracking your finances by adding your first transaction."
                actionText="Add Transaction"
                onAction={() => setShowTransactionModal(true)}
              />
            ) : (
              <div className="divide-y divide-gray-100 -mx-6">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.Id} className="px-6">
                    <TransactionItem 
                      transaction={transaction} 
                      showActions={false}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-6">
          {/* Budget Overview */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Budget Status
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = "/budgets"}
              >
                <ApperIcon name="Settings" size={16} />
              </Button>
            </div>
            
            {budgetStatus.totalBudgeted > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Spent</span>
                  <span className="text-sm font-medium">
                    ${budgetStatus.totalSpent.toLocaleString()} / ${budgetStatus.totalBudgeted.toLocaleString()}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      budgetStatus.progress > 90 
                        ? "bg-gradient-to-r from-error to-red-600" 
                        : budgetStatus.progress > 75 
                        ? "bg-gradient-to-r from-warning to-yellow-600"
                        : "bg-gradient-to-r from-primary-500 to-secondary-500"
                    }`}
                    style={{ width: `${Math.min(budgetStatus.progress, 100)}%` }}
                  />
                </div>
                
                <div className="text-center">
                  <span className={`text-sm font-medium ${
                    budgetStatus.progress > 90 ? "text-error" : "text-gray-600"
                  }`}>
                    {budgetStatus.progress.toFixed(0)}% of budget used
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <ApperIcon name="PiggyBank" size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No budgets set for this month</p>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => window.location.href = "/budgets"}
                >
                  Set Budget
                </Button>
              </div>
            )}
          </Card>

          {/* Goals Summary */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Savings Goals
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = "/goals"}
              >
                <ApperIcon name="Plus" size={16} />
              </Button>
            </div>
            
            {goals.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Progress</span>
                  <span className="text-sm font-medium">
                    ${savingsProgress.totalCurrent.toLocaleString()} / ${savingsProgress.totalTarget.toLocaleString()}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-success to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(savingsProgress.progress, 100)}%` }}
                  />
                </div>
                
                <div className="text-center">
                  <span className="text-sm font-medium text-success">
                    {savingsProgress.progress.toFixed(0)}% complete
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 text-center">
                  {goals.length} active goal{goals.length !== 1 ? "s" : ""}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <ApperIcon name="Target" size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No savings goals yet</p>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => window.location.href = "/goals"}
                >
                  Create Goal
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        onSubmit={handleAddTransaction}
        mode="add"
      />
    </div>
  );
};

export default Dashboard;