import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import GoalCard from "@/components/molecules/GoalCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import GoalModal from "@/components/organisms/GoalModal";
import ApperIcon from "@/components/ApperIcon";
import { goalService } from "@/services/api/goalService";
import { toast } from "react-toastify";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  
  // Add funds state
  const [addFundsAmount, setAddFundsAmount] = useState("");

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    setError("");
    try {
      const goalsData = await goalService.getAll();
      setGoals(goalsData);
    } catch (err) {
      setError("Failed to load savings goals");
      console.error("Goals loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Categorize goals
  const categorizeGoals = () => {
    const active = goals.filter(goal => goal.currentAmount < goal.targetAmount);
    const completed = goals.filter(goal => goal.currentAmount >= goal.targetAmount);
    
    return { active, completed };
  };

  // Calculate total progress
  const getTotalProgress = () => {
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const progress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
    
    return { totalTarget, totalCurrent, progress };
  };

  const handleAddGoal = async (goalData) => {
    await goalService.create(goalData);
    await loadGoals();
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setModalMode("edit");
    setShowGoalModal(true);
  };

  const handleUpdateGoal = async (goalData) => {
    await goalService.update(editingGoal.Id, goalData);
    await loadGoals();
  };

  const handleDeleteGoal = async (goal) => {
    if (window.confirm("Are you sure you want to delete this savings goal? This action cannot be undone.")) {
      try {
        await goalService.delete(goal.Id);
        await loadGoals();
        toast.success("Goal deleted successfully");
      } catch (error) {
        console.error("Failed to delete goal:", error);
        toast.error("Failed to delete goal");
      }
    }
  };

  const handleAddFunds = (goal) => {
    setSelectedGoal(goal);
    setAddFundsAmount("");
    setShowAddFundsModal(true);
  };

  const submitAddFunds = async () => {
    if (!selectedGoal || !addFundsAmount || parseFloat(addFundsAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const newAmount = selectedGoal.currentAmount + parseFloat(addFundsAmount);
      const updatedGoal = {
        ...selectedGoal,
        currentAmount: newAmount,
      };
      
      await goalService.update(selectedGoal.Id, updatedGoal);
      await loadGoals();
      setShowAddFundsModal(false);
      setSelectedGoal(null);
      setAddFundsAmount("");
      
      const isCompleted = newAmount >= selectedGoal.targetAmount;
      toast.success(
        isCompleted 
          ? `Congratulations! You've completed your "${selectedGoal.name}" goal!` 
          : `Successfully added $${parseFloat(addFundsAmount).toLocaleString()} to your goal!`
      );
    } catch (error) {
      console.error("Failed to add funds:", error);
      toast.error("Failed to add funds to goal");
    }
  };

  const closeGoalModal = () => {
    setShowGoalModal(false);
    setEditingGoal(null);
    setModalMode("add");
  };

  const closeAddFundsModal = () => {
    setShowAddFundsModal(false);
    setSelectedGoal(null);
    setAddFundsAmount("");
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return (
      <Error 
        type="data" 
        message={error} 
        onRetry={loadGoals} 
      />
    );
  }

  const { active, completed } = categorizeGoals();
  const totalProgress = getTotalProgress();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Savings Goals
          </h1>
          <p className="text-gray-600 mt-1">
            Set and track your progress towards financial milestones
          </p>
        </div>
        
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => {
            setModalMode("add");
            setShowGoalModal(true);
          }}
          className="mt-4 sm:mt-0"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Create Goal
        </Button>
      </div>

      {/* Total Progress Summary */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-success/5 to-green-50 rounded-card p-6 border border-success/20">
            <div className="flex items-center space-x-3 mb-2">
              <ApperIcon name="Target" size={20} className="text-success" />
              <span className="text-sm font-medium text-success">Total Progress</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {totalProgress.progress.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">
              ${totalProgress.totalCurrent.toLocaleString()} of ${totalProgress.totalTarget.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-card p-6">
            <div className="flex items-center space-x-3 mb-2">
              <ApperIcon name="TrendingUp" size={20} className="text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Active Goals</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {active.length}
            </div>
            <div className="text-sm text-gray-600">
              In progress
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-accent-50 to-yellow-50 rounded-card p-6">
            <div className="flex items-center space-x-3 mb-2">
              <ApperIcon name="Trophy" size={20} className="text-accent-600" />
              <span className="text-sm font-medium text-accent-700">Completed</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {completed.length}
            </div>
            <div className="text-sm text-gray-600">
              Goals achieved
            </div>
          </div>
        </div>
      )}

      {/* Goals List */}
      {goals.length === 0 ? (
        <Empty 
          type="goals"
          title="No savings goals yet"
          description="Set your first savings goal and watch your progress as you work towards financial freedom."
          actionText="Create Goal"
          onAction={() => {
            setModalMode("add");
            setShowGoalModal(true);
          }}
        />
      ) : (
        <div className="space-y-8">
          {/* Active Goals */}
          {active.length > 0 && (
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <ApperIcon name="TrendingUp" size={20} className="text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Active Goals ({active.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {active.map((goal) => (
                  <GoalCard
                    key={goal.Id}
                    goal={goal}
                    onEdit={handleEditGoal}
                    onDelete={handleDeleteGoal}
                    onAddFunds={handleAddFunds}
                    showActions={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Goals */}
          {completed.length > 0 && (
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <ApperIcon name="Trophy" size={20} className="text-accent-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Completed Goals ({completed.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completed.map((goal) => (
                  <GoalCard
                    key={goal.Id}
                    goal={goal}
                    onEdit={handleEditGoal}
                    onDelete={handleDeleteGoal}
                    showActions={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Goal Modal */}
      <GoalModal
        isOpen={showGoalModal}
        onClose={closeGoalModal}
        onSubmit={modalMode === "edit" ? handleUpdateGoal : handleAddGoal}
        goal={editingGoal}
        mode={modalMode}
      />

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-card shadow-card-hover max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Add Funds to Goal
              </h2>
              <button
                onClick={closeAddFundsModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedGoal && (
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
                  <h3 className="font-semibold text-primary-800 mb-2">
                    {selectedGoal.name}
                  </h3>
                  <div className="text-sm text-primary-700 space-y-1">
                    <div>Current: ${selectedGoal.currentAmount.toLocaleString()}</div>
                    <div>Target: ${selectedGoal.targetAmount.toLocaleString()}</div>
                    <div>Remaining: ${(selectedGoal.targetAmount - selectedGoal.currentAmount).toLocaleString()}</div>
                  </div>
                </div>
              )}

              <Input
                label="Amount to Add"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={addFundsAmount}
                onChange={(e) => setAddFundsAmount(e.target.value)}
                required
              />

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeAddFundsModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={submitAddFunds}
                  className="flex-1"
                >
                  Add Funds
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;