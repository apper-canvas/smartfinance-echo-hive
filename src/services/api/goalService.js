import goalsData from "@/services/mockData/goals.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GoalService {
  constructor() {
    this.goals = [...goalsData];
  }

  async getAll() {
    await delay(300);
    return [...this.goals];
  }

  async getById(id) {
    await delay(200);
    const goal = this.goals.find(g => g.Id === parseInt(id));
    if (!goal) {
      throw new Error(`Goal with Id ${id} not found`);
    }
    return { ...goal };
  }

  async create(goalData) {
    await delay(400);
    
    // Find highest Id and add 1
    const maxId = Math.max(...this.goals.map(g => g.Id), 0);
    const newGoal = {
      ...goalData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
    };
    
    this.goals.push(newGoal);
    return { ...newGoal };
  }

  async update(id, goalData) {
    await delay(400);
    
    const index = this.goals.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Goal with Id ${id} not found`);
    }
    
    this.goals[index] = {
      ...this.goals[index],
      ...goalData,
      Id: parseInt(id), // Ensure Id remains unchanged
    };
    
    return { ...this.goals[index] };
  }

  async delete(id) {
    await delay(300);
    
    const index = this.goals.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Goal with Id ${id} not found`);
    }
    
    const deletedGoal = this.goals[index];
    this.goals.splice(index, 1);
    return { ...deletedGoal };
  }

  // Additional helper methods
  async getActiveGoals() {
    await delay(250);
    return this.goals.filter(g => g.currentAmount < g.targetAmount);
  }

  async getCompletedGoals() {
    await delay(250);
    return this.goals.filter(g => g.currentAmount >= g.targetAmount);
  }

  async addFunds(id, amount) {
    await delay(300);
    
    const index = this.goals.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Goal with Id ${id} not found`);
    }
    
    this.goals[index].currentAmount += parseFloat(amount);
    return { ...this.goals[index] };
  }

  async getGoalProgress(id) {
    await delay(150);
    
    const goal = this.goals.find(g => g.Id === parseInt(id));
    if (!goal) {
      throw new Error(`Goal with Id ${id} not found`);
    }
    
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;
    const isCompleted = goal.currentAmount >= goal.targetAmount;
    
    return {
      progress: Math.min(progress, 100),
      remaining: Math.max(remaining, 0),
      isCompleted,
    };
  }
}

export const goalService = new GoalService();