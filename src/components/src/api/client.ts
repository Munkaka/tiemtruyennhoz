
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export const api = {
  async get(endpoint: string) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed, usually handled by browser or custom logic
          'X-Encrypted-Yw-ID': localStorage.getItem('yw_user_id') || '',
          'X-Is-Login': localStorage.getItem('yw_is_login') || '0'
        }
      });
      return await res.json();
    } catch (e) {
      console.error(`API Error GET ${endpoint}`, e);
      return null;
    }
  },

  async post(endpoint: string, data: any) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Encrypted-Yw-ID': localStorage.getItem('yw_user_id') || '',
          'X-Is-Login': localStorage.getItem('yw_is_login') || '0'
        },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e) {
      console.error(`API Error POST ${endpoint}`, e);
      return null;
    }
  },

  async getUserInfo() {
    try {
      // In a real app, you might fetch this from your backend or use the platform's user info
      // For this project, we use the backend's /api/user/me endpoint if available
      const res = await fetch(`${BASE_URL}/api/user/me`, {
        headers: {
          'X-Encrypted-Yw-ID': localStorage.getItem('yw_user_id') || '',
        }
      });
      if (res.ok) return await res.json();
      return null;
    } catch (e) {
      return null;
    }
  }
};
