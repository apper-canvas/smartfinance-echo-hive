import { getApperClient } from "@/services/apperClient";

class GoalService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('goal_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching goals:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('goal_c', parseInt(id), {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching goal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(goalData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('goal_c', {
        records: [{
          name_c: goalData.name,
          target_amount_c: parseFloat(goalData.targetAmount),
          current_amount_c: parseFloat(goalData.currentAmount) || 0,
          deadline_c: goalData.deadline,
          created_at_c: new Date().toISOString()
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
          console.error(`Failed to create ${failed.length} goals: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating goal:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, goalData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.updateRecord('goal_c', {
        records: [{
          Id: parseInt(id),
          name_c: goalData.name,
          target_amount_c: parseFloat(goalData.targetAmount),
          current_amount_c: parseFloat(goalData.currentAmount),
          deadline_c: goalData.deadline
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
          console.error(`Failed to update ${failed.length} goals: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating goal:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('goal_c', {
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
          console.error(`Failed to delete ${failed.length} goals: ${JSON.stringify(failed)}`);
        }
        
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting goal:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getActiveGoals() {
    const goals = await this.getAll();
    return goals.filter(g => g.current_amount_c < g.target_amount_c);
  }

  async getCompletedGoals() {
    const goals = await this.getAll();
    return goals.filter(g => g.current_amount_c >= g.target_amount_c);
  }

  async addFunds(id, amount) {
    try {
      const goal = await this.getById(id);
      if (!goal) {
        throw new Error(`Goal with Id ${id} not found`);
      }

      const newAmount = goal.current_amount_c + parseFloat(amount);
      return await this.update(id, {
        name: goal.name_c,
        targetAmount: goal.target_amount_c,
        currentAmount: newAmount,
        deadline: goal.deadline_c
      });
    } catch (error) {
      console.error("Error adding funds to goal:", error?.response?.data?.message || error);
      return null;
    }
  }

  async getGoalProgress(id) {
    try {
      const goal = await this.getById(id);
      if (!goal) {
        throw new Error(`Goal with Id ${id} not found`);
      }

      const progress = (goal.current_amount_c / goal.target_amount_c) * 100;
      const remaining = goal.target_amount_c - goal.current_amount_c;
      const isCompleted = goal.current_amount_c >= goal.target_amount_c;

      return {
        progress: Math.min(progress, 100),
        remaining: Math.max(remaining, 0),
        isCompleted,
      };
    } catch (error) {
      console.error("Error calculating goal progress:", error?.response?.data?.message || error);
      return null;
    }
  }
}

export const goalService = new GoalService();
export const goalService = new GoalService();