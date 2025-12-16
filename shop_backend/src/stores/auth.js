import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import { login as loginApi, getProfile } from '../api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    admin: null,
    profileLoaded: false,
    loading: false,
  }),
  actions: {
    async login(payload) {
      this.loading = true;
      try {
        const { token } = await loginApi(payload);
        this.token = token;
        localStorage.setItem('token', token);
        await this.fetchProfile();
        ElMessage.success('登录成功');
      } finally {
        this.loading = false;
      }
    },
    async fetchProfile() {
      if (!this.token) {
        this.admin = null;
        this.profileLoaded = false;
        return;
      }
      const data = await getProfile();
      this.admin = data;
      this.profileLoaded = true;
    },
    logout() {
      this.token = '';
      this.admin = null;
      this.profileLoaded = false;
      localStorage.removeItem('token');
    },
  },
});

