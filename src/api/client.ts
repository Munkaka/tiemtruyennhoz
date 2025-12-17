const BASE_URL = import.meta.env.VITE_API_URL || 'https://tiemtruyennhoz.anhthu102726.workers.dev';

export const api = {
  async get(endpoint: string) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
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
