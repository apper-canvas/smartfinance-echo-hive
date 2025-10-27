import { getApperClient } from "@/services/apperClient";

class BudgetService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('budget_c', {
        fields: [
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "category_id_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching budgets:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('budget_c', parseInt(id), {
        fields: [
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "category_id_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(budgetData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('budget_c', {
        records: [{
          amount_c: parseFloat(budgetData.amount),
          month_c: budgetData.month,
          spent_c: 0,
          category_id_c: parseInt(budgetData.categoryId)
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} budgets: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating budget:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, budgetData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.updateRecord('budget_c', {
        records: [{
          Id: parseInt(id),
          amount_c: parseFloat(budgetData.amount),
          month_c: budgetData.month,
          category_id_c: parseInt(budgetData.categoryId)
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} budgets: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating budget:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('budget_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} budgets: ${JSON.stringify(failed)}`);
        }
        
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting budget:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByMonth(month) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('budget_c', {
        fields: [
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "category_id_c"}}
        ],
        where: [{
          FieldName: "month_c",
          Operator: "EqualTo",
          Values: [month]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching budgets by month:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByCategory(categoryId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('budget_c', {
        fields: [
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "category_id_c"}}
        ],
        where: [{
          FieldName: "category_id_c",
          Operator: "EqualTo",
          Values: [parseInt(categoryId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching budgets by category:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByCategoryAndMonth(categoryId, month) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('budget_c', {
        fields: [
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "category_id_c"}}
        ],
        whereGroups: [{
          operator: "AND",
          subGroups: [{
            conditions: [
              {
                fieldName: "category_id_c",
                operator: "EqualTo",
                values: [parseInt(categoryId)]
              },
              {
                fieldName: "month_c",
                operator: "EqualTo",
                values: [month]
              }
            ]
          }]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data?.[0] || null;
    } catch (error) {
      console.error("Error fetching budget by category and month:", error?.response?.data?.message || error);
      return null;
    }
  }

  async updateSpentAmount(id, spentAmount) {
    try {
      const budget = await this.getById(id);
      if (!budget) {
        throw new Error(`Budget with Id ${id} not found`);
      }

      const apperClient = getApperClient();
      const response = await apperClient.updateRecord('budget_c', {
        records: [{
          Id: parseInt(id),
          spent_c: parseFloat(spentAmount)
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating budget spent amount:", error?.response?.data?.message || error);
      return null;
    }
  }
}

export const budgetService = new BudgetService();