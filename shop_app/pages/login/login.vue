<template>
  <view class="container">
    <view class="title">欢迎登录</view>
    <view class="form-item">
      <input class="input" v-model="username" placeholder="请输入用户名" />
    </view>
    <view class="form-item">
      <input class="input" type="password" v-model="password" placeholder="请输入密码" />
    </view>
    <button class="btn" @click="handleLogin">账号密码登录</button>
    <view class="other-login-title">或</view>
    <button class="btn wx-btn" @click="handleWxLogin">微信一键登录</button>
    <view class="link" @click="goToRegister">没有账号？去注册</view>
  </view>
</template>

<script>
import { login, wechatLogin } from '@/api/auth';

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
    async handleWxLogin() {
      uni.showLoading({ title: '登录中...', mask: true });
      uni.getUserInfo({
        provider: 'weixin',
        success: (userRes) => {
          console.log(userRes);
          const userInfo = userRes.userInfo || {};
          const nickname = userInfo.nickName || '';
          const avatarUrl = userInfo.avatarUrl || '';
          uni.login({
            provider: 'weixin',
            success: async (loginRes) => {
              console.log(loginRes);
              try {
                const { data } = await wechatLogin({
                  code: "0b36vpll24RWPg4aNTkl2z0WCk06vplt",
                  nickname,
                  avatar_url: avatarUrl
                });
                uni.setStorageSync('token', data.token);
                uni.setStorageSync('user', data.user);
                const app = getApp();
                if (app && app.checkLoginStatus) {
                  app.checkLoginStatus();
                }
                uni.hideLoading();
                uni.showToast({ title: '登录成功' });
                setTimeout(() => {
                  uni.switchTab({ url: '/pages/index/index' });
                }, 1500);
              } catch (err) {
                uni.hideLoading();
                console.error(err);
                uni.showToast({ title: '微信登录失败', icon: 'none' });
              }
            },
            fail: (err) => {
              uni.hideLoading();
              console.error(err);
              uni.showToast({ title: '微信登录失败', icon: 'none' });
            }
          });
        },
        fail: (err) => {
          uni.hideLoading();
          console.error(err);
          uni.showToast({ title: '微信授权失败', icon: 'none' });
        }
      });
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
.wx-btn { background-color: #07c160; margin-top: 15px; }
.other-login-title { text-align: center; margin-top: 20px; color: #999; font-size: 14px; }
.link { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
</style>
