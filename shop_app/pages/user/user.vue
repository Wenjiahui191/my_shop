<template>
  <view class="container">
    <view class="user-info" v-if="user">
      <image class="avatar" src="/static/logo.png"></image>
      <view class="info">
        <view class="nickname">{{ user.nickname || user.username }}</view>
        <view class="phone">{{ user.phone }}</view>
      </view>
    </view>
    <view class="user-info" v-else @click="goToLogin">
      <image class="avatar" src="/static/logo.png"></image>
      <view class="info">
        <view class="nickname">点击登录</view>
      </view>
    </view>

    <view class="menu-list">
      <view class="menu-item" @click="goToOrders" v-if="user">
        <text>我的订单</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="goToAddresses" v-if="user">
        <text>收货地址管理</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="logout" v-if="user">
        <text>退出登录</text>
        <text class="arrow">></text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      user: null
    };
  },
  onShow() {
    this.user = uni.getStorageSync('user');
  },
  methods: {
    goToLogin() {
      uni.navigateTo({ url: '/pages/login/login' });
    },
    goToOrders() {
      uni.navigateTo({ url: '/pages/order/list' });
    },
    goToAddresses() {
      uni.navigateTo({ url: '/pages/address/list' });
    },
    logout() {
      uni.removeStorageSync('token');
      uni.removeStorageSync('user');
      this.user = null;
      uni.showToast({ title: '已退出' });
      
      // 调用 App.vue 的方法更新 tabBar
      const app = getApp();
      app.checkLoginStatus();
      
      setTimeout(() => {
          uni.reLaunch({ url: '/pages/index/index' });
      }, 1000);
    }
  }
};
</script>

<style>
.container { min-height: 100vh; background-color: #f8f8f8; }
.user-info { display: flex; align-items: center; padding: 30px 20px; background-color: #3cc51f; color: #fff; }
.avatar { width: 60px; height: 60px; border-radius: 50%; margin-right: 15px; background-color: #fff; }
.nickname { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
.phone { font-size: 14px; opacity: 0.8; }
.menu-list { margin-top: 10px; background-color: #fff; }
.menu-item { display: flex; justify-content: space-between; padding: 15px; border-bottom: 1px solid #eee; font-size: 16px; }
.arrow { color: #ccc; }
</style>
