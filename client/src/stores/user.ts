import { defineStore } from 'pinia';

interface UserState {
  user: {
    id: number;
    email: string;
  } | null;
  token: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    token: null
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) throw new Error('Login failed');

        const data = await response.json();
        this.user = data.user;
        this.token = data.token;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
    }
  },

  persist: true
}); 