import categoriesData from "@/services/mockData/categories.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  async getAll() {
    await delay(200);
    return [...this.categories];
  }

  async getById(id) {
    await delay(150);
    const category = this.categories.find(c => c.Id === parseInt(id));
    if (!category) {
      throw new Error(`Category with Id ${id} not found`);
    }
    return { ...category };
  }

async create(categoryData) {
    await delay(300);
    
    // Find highest Id and add 1
    const maxId = Math.max(...this.categories.map(c => c.Id), 0);
    const newCategory = {
      name: categoryData.name,
      type: categoryData.type,
      color: categoryData.color || "#3B82F6",
      icon: categoryData.icon || "ShoppingCart",
      Id: maxId + 1,
    };
    
    this.categories.push(newCategory);
    return { ...newCategory };
  }

async update(id, categoryData) {
    await delay(300);
    
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Category with Id ${id} not found`);
    }
    
    this.categories[index] = {
      ...this.categories[index],
      name: categoryData.name,
      type: categoryData.type,
      color: categoryData.color || this.categories[index].color,
      icon: categoryData.icon || this.categories[index].icon,
      Id: parseInt(id), // Ensure Id remains unchanged
    };
    
    return { ...this.categories[index] };
  }

  async delete(id) {
    await delay(250);
    
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Category with Id ${id} not found`);
    }
    
    const deletedCategory = this.categories[index];
    this.categories.splice(index, 1);
    return { ...deletedCategory };
  }

  // Additional helper methods
  async getByType(type) {
    await delay(150);
    return this.categories.filter(c => c.type === type);
  }

  async getIncomeCategories() {
    return this.getByType("income");
  }

  async getExpenseCategories() {
    return this.getByType("expense");
  }
}

export const categoryService = new CategoryService();