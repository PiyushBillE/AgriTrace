import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b9466d4b`;

class ApiClient {
  private getHeaders(includeAuth = true) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (includeAuth) {
      headers.Authorization = `Bearer ${publicAnonKey}`;
    }
    
    return headers;
  }

  // Batch operations
  async createBatch(batchData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/batches`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(batchData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create batch');
      }
      
      return result;
    } catch (error) {
      console.error('API Error - Create Batch:', error);
      throw error;
    }
  }

  async getUserBatches(userId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/batches/${userId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch batches');
      }
      
      return result;
    } catch (error) {
      console.error('API Error - Get User Batches:', error);
      throw error;
    }
  }

  async getBatch(batchId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/batch/${batchId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch batch');
      }
      
      return result;
    } catch (error) {
      console.error('API Error - Get Batch:', error);
      throw error;
    }
  }

  async transferBatch(batchId: string, transferData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/batches/${batchId}/transfer`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(transferData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to transfer batch');
      }
      
      return result;
    } catch (error) {
      console.error('API Error - Transfer Batch:', error);
      throw error;
    }
  }

  // User operations
  async getUser(userId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch user');
      }
      
      return result;
    } catch (error) {
      console.error('API Error - Get User:', error);
      throw error;
    }
  }

  async updateUser(userId: string, userData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(userData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user');
      }
      
      return result;
    } catch (error) {
      console.error('API Error - Update User:', error);
      throw error;
    }
  }

  // Demo QR operations
  async getDemoQRData(qrId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/demo/qr/${qrId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch demo data');
      }
      
      return result;
    } catch (error) {
      console.error('API Error - Get Demo QR Data:', error);
      throw error;
    }
  }

  // Expense operations
  async createExpense(expenseData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(expenseData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create expense');
      }
      
      return result;
    } catch (error) {
      console.error('API Error - Create Expense:', error);
      throw error;
    }
  }

  async getAllExpenses() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/expenses`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch expenses');
      }
      
      return result;
    } catch (error) {
      console.error('API Error - Get All Expenses:', error);
      throw error;
    }
  }

  async getCropExpenses(cropType: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/expenses/crop/${encodeURIComponent(cropType)}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch crop expenses');
      }
      
      return result;
    } catch (error) {
      console.error('API Error - Get Crop Expenses:', error);
      throw error;
    }
  }

  async getFarmerExpenses(farmerId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/farmers/${farmerId}/expenses`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch farmer expenses');
      }
      
      return result;
    } catch (error) {
      console.error('API Error - Get Farmer Expenses:', error);
      throw error;
    }
  }

  async getCropTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/crop-types`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch crop types');
      }
      
      return result;
    } catch (error) {
      console.error('API Error - Get Crop Types:', error);
      throw error;
    }
  }
}

export const api = new ApiClient();