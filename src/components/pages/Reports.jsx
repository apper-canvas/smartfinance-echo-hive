import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import PieChart from "@/components/organisms/PieChart";
import LineChart from "@/components/organisms/LineChart";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartLoading, setChartLoading] = useState(false);
  
  // Filter states
  const [selectedPeriod, setSelectedPeriod] = useState("6"); // Last 6 months
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      setChartLoading(true);
      // Simulate chart data processing
      setTimeout(() => setChartLoading(false), 500);
    }
  }, [selectedPeriod, selectedMonth, transactions]);

  const loadTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const transactionsData = await transactionService.getAll();
      setTransactions(transactionsData);
    } catch (err) {
      setError("Failed to load transaction data for reports");
      console.error("Reports loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generate pie chart data for expenses by category
  const generatePieChartData = () => {
    const monthStart = startOfMonth(new Date(selectedMonth + "-01"));
    const monthEnd = endOfMonth(new Date(selectedMonth + "-01"));

    const monthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction.type === "expense" &&
        transactionDate >= monthStart &&
        transactionDate <= monthEnd
      );
    });

    if (monthTransactions.length === 0) return [];

    const categoryTotals = {};
    monthTransactions.forEach(transaction => {
      if (categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] += transaction.amount;
      } else {
        categoryTotals[transaction.category] = transaction.amount;
      }
    });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  // Generate line chart data for income vs expenses trend
  const generateLineChartData = () => {
    const months = parseInt(selectedPeriod);
    const data = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const monthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });

      const income = monthTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({
        month: format(monthDate, "yyyy-MM-dd"),
        income,
        expenses,
      });
    }

    return data;
  };

  // Calculate summary statistics
  const calculateSummaryStats = () => {
    const months = parseInt(selectedPeriod);
    const cutoffDate = subMonths(new Date(), months);
    
    const periodTransactions = transactions.filter(transaction => 
      new Date(transaction.date) >= cutoffDate
    );

    const totalIncome = periodTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = periodTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const avgMonthlyIncome = totalIncome / months;
    const avgMonthlyExpenses = totalExpenses / months;
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // Top spending category
    const expensesByCategory = {};
    periodTransactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    const topCategory = Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      totalIncome,
      totalExpenses,
      avgMonthlyIncome,
      avgMonthlyExpenses,
      netSavings,
      savingsRate,
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
      transactionCount: periodTransactions.length,
    };
  };

  const exportData = () => {
    const pieData = generatePieChartData();
    const lineData = generateLineChartData();
    const stats = calculateSummaryStats();
    
    const exportData = {
      summary: stats,
      expensesByCategory: pieData,
      monthlyTrend: lineData,
      exportDate: new Date().toISOString(),
      period: `Last ${selectedPeriod} months`,
      pieChartMonth: format(new Date(selectedMonth + "-01"), "MMMM yyyy"),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `smartfinance-report-${format(new Date(), "yyyy-MM-dd")}.json`;
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return (
      <Error 
        type="data" 
        message={error} 
        onRetry={loadTransactions} 
      />
    );
  }

  if (transactions.length === 0) {
    return (
      <Empty 
        type="reports"
        title="No transaction data"
        description="Add some transactions to see beautiful charts and insights about your spending patterns."
        actionText="Add Transaction"
        onAction={() => window.location.href = "/transactions"}
      />
    );
  }

  const pieChartData = generatePieChartData();
  const lineChartData = generateLineChartData();
  const stats = calculateSummaryStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Financial Reports
          </h1>
          <p className="text-gray-600 mt-1">
            Analyze your spending patterns and financial trends
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="lg"
          onClick={exportData}
          className="mt-4 sm:mt-0"
        >
          <ApperIcon name="Download" size={16} className="mr-2" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">
            Report Filters
          </h3>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full sm:w-auto"
            >
              <option value="3">Last 3 months</option>
              <option value="6">Last 6 months</option>
              <option value="12">Last 12 months</option>
            </Select>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pie Chart Month
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center bg-gradient-to-br from-success/5 to-green-50 border border-success/20">
          <div className="text-sm text-success font-medium mb-1">Avg Monthly Income</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ${stats.avgMonthlyIncome.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">
            Total: ${stats.totalIncome.toLocaleString()}
          </div>
        </Card>
        
        <Card className="text-center bg-gradient-to-br from-error/5 to-red-50 border border-error/20">
          <div className="text-sm text-error font-medium mb-1">Avg Monthly Expenses</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ${stats.avgMonthlyExpenses.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">
            Total: ${stats.totalExpenses.toLocaleString()}
          </div>
        </Card>
        
        <Card className={`text-center bg-gradient-to-br ${
          stats.netSavings >= 0 
            ? "from-primary-50 to-secondary-50 border border-primary-200" 
            : "from-warning/5 to-yellow-50 border border-warning/20"
        }`}>
          <div className={`text-sm font-medium mb-1 ${
            stats.netSavings >= 0 ? "text-primary-700" : "text-warning"
          }`}>
            Net Savings
          </div>
          <div className={`text-2xl font-bold mb-1 ${
            stats.netSavings >= 0 ? "text-gray-900" : "text-warning"
          }`}>
            ${Math.abs(stats.netSavings).toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">
            {stats.savingsRate.toFixed(1)}% savings rate
          </div>
        </Card>
        
        <Card className="text-center bg-gradient-to-br from-accent-50 to-yellow-50 border border-accent-200">
          <div className="text-sm text-accent-700 font-medium mb-1">Top Category</div>
          <div className="text-lg font-bold text-gray-900 mb-1">
            {stats.topCategory ? stats.topCategory.name : "None"}
          </div>
          <div className="text-xs text-gray-600">
            {stats.topCategory ? `$${stats.topCategory.amount.toLocaleString()}` : "No expenses"}
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Expense Pie Chart */}
        <PieChart
          data={pieChartData}
          title={`Expenses by Category - ${format(new Date(selectedMonth + "-01"), "MMMM yyyy")}`}
          loading={chartLoading}
          error={null}
          onRetry={loadTransactions}
        />

        {/* Income vs Expenses Line Chart */}
        <LineChart
          data={lineChartData}
          title={`Income vs Expenses Trend - Last ${selectedPeriod} Months`}
          loading={chartLoading}
          error={null}
          onRetry={loadTransactions}
        />
      </div>

      {/* Insights */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Key Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex-shrink-0 mt-0.5">
                <ApperIcon name="TrendingUp" size={12} className="text-white m-1.5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Savings Performance</h4>
                <p className="text-sm text-gray-600">
                  {stats.savingsRate > 20 
                    ? "Excellent! You're saving over 20% of your income." 
                    : stats.savingsRate > 10
                    ? "Good savings rate! Consider increasing to 20% if possible."
                    : stats.savingsRate > 0
                    ? "You're saving money, but there's room for improvement."
                    : "Consider reducing expenses to start building savings."}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-accent-500 to-yellow-600 rounded-full flex-shrink-0 mt-0.5">
                <ApperIcon name="PieChart" size={12} className="text-white m-1.5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Spending Patterns</h4>
                <p className="text-sm text-gray-600">
                  {stats.topCategory 
                    ? `Your highest expense category is ${stats.topCategory.name}. Review if this aligns with your priorities.`
                    : "Add more transactions to see spending pattern insights."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-success to-green-600 rounded-full flex-shrink-0 mt-0.5">
                <ApperIcon name="Target" size={12} className="text-white m-1.5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Monthly Average</h4>
                <p className="text-sm text-gray-600">
                  Your average monthly surplus/deficit is ${Math.abs(stats.avgMonthlyIncome - stats.avgMonthlyExpenses).toLocaleString()}.
                  {stats.avgMonthlyIncome > stats.avgMonthlyExpenses 
                    ? " Great job maintaining positive cash flow!"
                    : " Focus on increasing income or reducing expenses."}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-info to-blue-600 rounded-full flex-shrink-0 mt-0.5">
                <ApperIcon name="BarChart3" size={12} className="text-white m-1.5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Activity Level</h4>
                <p className="text-sm text-gray-600">
                  You've recorded {stats.transactionCount} transactions over the last {selectedPeriod} months. 
                  {stats.transactionCount / parseInt(selectedPeriod) > 10
                    ? " Great job staying on top of your finances!"
                    : " Consider tracking more transactions for better insights."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;