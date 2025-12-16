<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const formRef = ref();
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const form = reactive({
  username: '',
  password: '',
});

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return;
    await auth.login(form);
    const redirect = route.query.redirect || '/';
    router.replace(redirect);
  });
};
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h2>商城后台管理</h2>
      <p class="subtitle">请输入管理员账号登录</p>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="0" size="large">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" clearable />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="密码" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w-full" :loading="auth.loading" @click="handleSubmit">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1f6feb 0%, #7c3aed 100%);
}

.login-card {
  width: 380px;
  padding: 32px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.login-card h2 {
  margin: 0 0 8px;
  color: #1f2d3d;
}

.subtitle {
  margin: 0 0 24px;
  color: #909399;
}

.w-full {
  width: 100%;
}
</style>

