<template>
  <view class="page">
    <scroll-view class="content" scroll-y>
      <view class="header">
        <image class="avatar" src="/static/logo.png" mode="aspectFill" />
        <view class="header-info">
          <view class="header-title">
            <text class="header-name">
              {{ userStore.user.value?.nickname || '请先登录' }}
            </text>
          </view>
          <view class="header-sub">
            <text v-if="!userStore.user.value">点击下方按钮，快速登录</text>
            <text v-else>欢迎回来</text>
          </view>
        </view>
      </view>

      <view class="order-card">
        <view class="order-row">
          <view class="order-item">
            <text class="order-icon">待</text>
            <text class="order-text">待付款</text>
          </view>
          <view class="order-item">
            <text class="order-icon">收</text>
            <text class="order-text">待收货</text>
          </view>
          <view class="order-item">
            <text class="order-icon">评</text>
            <text class="order-text">待评价</text>
          </view>
          <view class="order-item">
            <text class="order-icon">售</text>
            <text class="order-text">售后单</text>
          </view>
          <view class="order-item">
            <text class="order-icon">全</text>
            <text class="order-text">全部订单</text>
          </view>
        </view>
      </view>

      <view class="grid">
        <view class="grid-item">
          <text class="grid-title">代理中心</text>
          <text class="grid-sub">点击注册</text>
        </view>
        <view class="grid-item">
          <text class="grid-title">分享记录</text>
          <text class="grid-sub">历史分享</text>
        </view>
        <view class="grid-item">
          <text class="grid-title">我的钱包</text>
          <text class="grid-sub">查看余额</text>
        </view>
        <view class="grid-item">
          <text class="grid-title">我的设置</text>
        </view>
        <view class="grid-item">
          <text class="grid-title">发圈素材</text>
        </view>
        <view class="grid-item" @tap="goAddress">
          <text class="grid-title">收货地址</text>
        </view>
      </view>

      <view v-if="!userStore.user.value" class="login-panel">
        <button class="wx-login" @tap="handleWxLogin">微信快捷登录</button>
        <view class="divider">或</view>
        <view class="form">
          <view class="form-item">
            <input
              v-model="form.username"
              class="input"
              type="text"
              placeholder="请输入用户名"
            />
          </view>
          <view class="form-item">
            <input
              v-model="form.password"
              class="input"
              type="password"
              password
              placeholder="请输入密码"
            />
          </view>
          <button class="submit" :loading="loading" @tap="handleSubmit">
            账号密码登录
          </button>
        </view>
      </view>
    </scroll-view>
    <BottomTabbar />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../../store/user';
import BottomTabbar from '../../components/BottomTabbar.vue';

const form = ref({
  username: '',
  password: '',
});

const loading = ref(false);
const userStore = useUserStore();

async function handleSubmit() {
  if (!form.value.username || !form.value.password) {
    uni.showToast({ title: '请填写账号和密码', icon: 'none' });
    return;
  }

  loading.value = true;
  try {
    await userStore.login(form.value);
    uni.showToast({ title: '登录成功', icon: 'success' });
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' });
    }, 300);
  } catch (e) {
  } finally {
    loading.value = false;
  }
}

function goAddress() {
  uni.showToast({ title: '收货地址暂未实现', icon: 'none' });
}

function handleWxLogin() {
  if (typeof uni.login !== 'function') {
    uni.showToast({ title: '请在微信中使用微信登录', icon: 'none' });
    return;
  }
  uni.login({
    provider: 'weixin',
    success(res) {
      const code = res.code;
      if (!code) {
        uni.showToast({ title: '微信登录失败，请稍后重试', icon: 'none' });
        return;
      }
      userStore
        .wechatLogin({ code })
        .then(() => {
          uni.showToast({ title: '登录成功', icon: 'success' });
          setTimeout(() => {
            uni.switchTab({ url: '/pages/index/index' });
          }, 300);
        })
        .catch(() => {})
        .finally(() => {});
    },
    fail() {
      uni.showToast({ title: '微信登录失败，请稍后重试', icon: 'none' });
    },
  });
}
</script>

<style scoped>
.page {
  height: 100vh;
  background-color: #f5f5f7;
  padding-bottom: 100rpx;
}

.content {
  height: 100%;
}

.header {
  display: flex;
  align-items: center;
  padding: 40rpx 32rpx 24rpx;
  background-color: #ffffff;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background-color: #f0f0f0;
}

.header-info {
  margin-left: 24rpx;
}

.header-title {
  display: flex;
  align-items: center;
}

.header-name {
  font-size: 32rpx;
  font-weight: 600;
}

.header-sub {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #999;
}

.order-card {
  margin-top: 12rpx;
  background-color: #ffffff;
  padding: 24rpx 0;
}

.order-row {
  display: flex;
  justify-content: space-around;
}

.order-item {
  align-items: center;
  text-align: center;
}

.order-icon {
  display: inline-block;
  width: 64rpx;
  height: 64rpx;
  line-height: 64rpx;
  border-radius: 32rpx;
  background-color: #f3f5f7;
  font-size: 28rpx;
  color: #666;
}

.order-text {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #333;
}

.grid {
  margin-top: 16rpx;
  display: flex;
  flex-wrap: wrap;
  background-color: #ffffff;
}

.grid-item {
  width: 33.33%;
  padding: 32rpx 0;
  text-align: center;
}

.grid-title {
  font-size: 26rpx;
  color: #333;
}

.grid-sub {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: #999;
}

.login-panel {
  margin: 24rpx 24rpx 32rpx;
  padding: 24rpx 24rpx 32rpx;
  border-radius: 24rpx;
  background-color: #ffffff;
}

.wx-login {
  background-color: #07c160;
  color: #ffffff;
  border-radius: 999rpx;
  padding: 16rpx 0;
  font-size: 30rpx;
}

.divider {
  margin: 24rpx 0;
  text-align: center;
  font-size: 24rpx;
  color: #999;
}

.form-item {
  margin-top: 24rpx;
}

.input {
  padding: 20rpx 24rpx;
  border-radius: 16rpx;
  background-color: #f5f5f7;
  font-size: 28rpx;
}

.submit {
  margin-top: 32rpx;
  background-color: #000000;
  color: #ffffff;
  border-radius: 999rpx;
  padding: 18rpx 0;
  font-size: 30rpx;
}
</style>


