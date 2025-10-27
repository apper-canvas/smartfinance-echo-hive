import budgetsData from "@/services/mockData/budgets.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BudgetService {
  constructor() {
    this.budgets = [...budgetsData];
  }

  async getAll() {
    await delay(300);
    return [...this.budgets];
  }

  async getById(id) {
    await delay(200);
    const budget = this.budgets.find(b => b.Id === parseInt(id));
    if (!budget) {
      throw new Error(`Budget with Id ${id} not found`);
    }
    return { ...budget };
  }

  async create(budgetData) {
    await delay(400);
    
    // Find highest Id and add 1
    const maxId = Math.max(...this.budgets.map(b => b.Id), 0);
    const newBudget = {
      ...budgetData,
      Id: maxId + 1,
      spent: 0, // Initialize spent amount
    };
    
    this.budgets.push(newBudget);
    return { ...newBudget };
  }

  async update(id, budgetData) {
    await delay(400);
    
    const index = this.budgets.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Budget with Id ${id} not found`);
    }
    
    this.budgets[index] = {
      ...this.budgets[index],
      ...budgetData,
      Id: parseInt(id), // Ensure Id remains unchanged
    };
    
    return { ...this.budgets[index] };
  }

  async delete(id) {
    await delay(300);
    
    const index = this.budgets.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Budget with Id ${id} not found`);
    }
    
    const deletedBudget = this.budgets[index];
    this.budgets.splice(index, 1);
    return { ...deletedBudget };
  }

  // Additional helper methods
  async getByMonth(month) {
    await delay(200);
    return this.budgets.filter(b => b.month === month);
  }

  async getByCategory(categoryId) {
    await delay(200);
    return this.budgets.filter(b => b.categoryId === categoryId);
  }

  async getByCategoryAndMonth(categoryId, month) {
    await delay(200);
    return this.budgets.find(b => b.categoryId === categoryId && b.month === month);
  }

  async updateSpentAmount(id, spentAmount) {
    await delay(250);
    
    const index = this.budgets.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Budget with Id ${id} not found`);
    }
    
    this.budgets[index].spent = spentAmount;
    return { ...this.budgets[index] };
  }
}

export const budgetService = new BudgetService();