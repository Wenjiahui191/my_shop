<template>
  <view class="container">
    <view class="title">注册账号</view>
    <view class="form-item">
      <input class="input" v-model="username" placeholder="请输入用户名" />
    </view>
    <view class="form-item">
      <input class="input" type="password" v-model="password" placeholder="请输入密码" />
    </view>
    <view class="form-item">
      <input class="input" v-model="phone" placeholder="请输入手机号" />
    </view>
    <view class="form-item">
      <input class="input" v-model="nickname" placeholder="请输入昵称" />
    </view>
    <button class="btn" @click="handleRegister">注册</button>
  </view>
</template>

<script>
import { register } from '@/api/auth';

export default {
  data() {
    return {
      username: '',
      password: '',
      phone: '',
      nickname: ''
    };
  },
  methods: {
    async handleRegister() {
      if (!this.username || !this.password || !this.phone) {
        uni.showToast({ title: '请填写完整', icon: 'none' });
        return;
      }
      try {
        await register({
          username: this.username,
          password: this.password,
          phone: this.phone,
          nickname: this.nickname
        });
        uni.showToast({ title: '注册成功' });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } catch (error) {
        console.error(error);
      }
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
</style>
