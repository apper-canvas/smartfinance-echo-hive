import transactionsData from "@/services/mockData/transactions.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData];
  }

  async getAll() {
    await delay(300);
    return [...this.transactions];
  }

  async getById(id) {
    await delay(200);
    const transaction = this.transactions.find(t => t.Id === parseInt(id));
    if (!transaction) {
      throw new Error(`Transaction with Id ${id} not found`);
    }
    return { ...transaction };
  }

  async create(transactionData) {
    await delay(400);
    
    // Find highest Id and add 1
    const maxId = Math.max(...this.transactions.map(t => t.Id), 0);
    const newTransaction = {
      ...transactionData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
    };
    
    this.transactions.push(newTransaction);
    return { ...newTransaction };
  }

  async update(id, transactionData) {
    await delay(400);
    
    const index = this.transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Transaction with Id ${id} not found`);
    }
    
    this.transactions[index] = {
      ...this.transactions[index],
      ...transactionData,
      Id: parseInt(id), // Ensure Id remains unchanged
    };
    
    return { ...this.transactions[index] };
  }

  async delete(id) {
    await delay(300);
    
    const index = this.transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Transaction with Id ${id} not found`);
    }
    
    const deletedTransaction = this.transactions[index];
    this.transactions.splice(index, 1);
    return { ...deletedTransaction };
  }

  // Additional helper methods
  async getByDateRange(startDate, endDate) {
    await delay(250);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });
  }

  async getByCategory(category) {
    await delay(200);
    return this.transactions.filter(t => t.category === category);
  }

  async getByType(type) {
    await delay(200);
    return this.transactions.filter(t => t.type === type);
  }
}

export const transactionService = new TransactionService();