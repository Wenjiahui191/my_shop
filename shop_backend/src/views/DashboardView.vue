<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return '早上好';
  if (hour < 18) return '下午好';
  return '晚上好';
});

const quickLinks = [
  { title: '用户管理', desc: '查看用户列表', path: '/users' },
  { title: '分类管理', desc: '维护商品分类', path: '/categories' },
  { title: '商品管理', desc: '上架或编辑商品', path: '/products' },
  { title: '订单管理', desc: '查看及发货订单', path: '/orders' },
];
</script>

<template>
  <div class="dashboard">
    <el-card class="welcome-card" shadow="hover">
      <div class="welcome-text">
        <h2>{{ greeting }}，{{ auth.admin?.username || '管理员' }}</h2>
        <p>欢迎进入商城后台管理中心</p>
      </div>
    </el-card>

    <div class="grid">
      <el-card v-for="item in quickLinks" :key="item.title" class="shortcut" shadow="hover">
        <div class="shortcut__title">{{ item.title }}</div>
        <div class="shortcut__desc">{{ item.desc }}</div>
        <el-button type="primary" link @click="$router.push(item.path)">立即前往</el-button>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.welcome-card {
  background: linear-gradient(135deg, #c3e5ff 0%, #e8d9ff 100%);
  border: none;
}

.welcome-text h2 {
  margin: 0 0 6px;
}

.welcome-text p {
  margin: 0;
  color: #666;
}

.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.shortcut {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shortcut__title {
  font-size: 16px;
  font-weight: 600;
}

.shortcut__desc {
  color: #909399;
  flex: 1;
}
</style>

