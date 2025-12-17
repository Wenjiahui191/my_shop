<template>
  <view class="container">
    <view class="title">欢迎登录</view>
    <view class="form-item">
      <input class="input" v-model="username" placeholder="请输入用户名" />
    </view>
    <view class="form-item">
      <input class="input" type="password" v-model="password" placeholder="请输入密码" />
    </view>
    <button class="btn" @click="handleLogin">登录</button>
    <view class="link" @click="goToRegister">没有账号？去注册</view>
  </view>
</template>

<script>
import { login } from '@/api/auth';

export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async handleLogin() {
      if (!this.username || !this.password) {
        uni.showToast({ title: '请填写完整', icon: 'none' });
        return;
      }
      try {
        const res = await login({ username: this.username, password: this.password });
        uni.setStorageSync('token', res.token);
        uni.setStorageSync('user', res.user);
        uni.showToast({ title: '登录成功' });
        
        // 调用 App.vue 的方法更新 tabBar
        const app = getApp();
        app.checkLoginStatus();
        
        setTimeout(() => {
          uni.switchTab({ url: '/pages/index/index' });
        }, 1500);
      } catch (error) {
        console.error(error);
      }
    },
    goToRegister() {
      uni.navigateTo({ url: '/pages/register/register' });
    }
  }
};
</script>

<style>
.container { padding: 50px 20px; }
.title { font-size: 24px; font-weight: bold; margin-bottom: 30px; text-align: center; }
.form-item { margin-bottom: 20px; border-bottom: 1px solid #eee; padding: 10px 0; }
.input { width: 100%; }
.btn { background-color: #3cc51f; color: #fff; margin-top: 30px; }
.link { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
</style>
