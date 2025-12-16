<script setup>
import { computed } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Menu, UserFilled, GoodsFilled, List, Tickets } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const menuItems = [
  { path: '/', label: '仪表盘', icon: Menu },
  { path: '/users', label: '用户管理', icon: UserFilled },
  { path: '/categories', label: '分类管理', icon: List },
  { path: '/products', label: '商品管理', icon: GoodsFilled },
  { path: '/orders', label: '订单管理', icon: Tickets },
];

const activePath = computed(() => (route.path === '/' ? '/' : `/${route.path.split('/')[1]}`));
const headerTitle = computed(() => route.meta?.title || '商城后台');

const handleSelect = (index) => {
  if (index !== route.path) {
    router.push(index);
  }
};

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<template>
  <el-container class="layout">
    <el-aside width="220px" class="layout__sider">
      <div class="brand">Shop Admin</div>
      <el-menu
        :default-active="activePath"
        class="el-menu-vertical-demo"
        background-color="#001529"
        text-color="#bfcbd9"
        active-text-color="#ffd04b"
        @select="handleSelect"
      >
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="layout__header">
        <div class="header-left">
          <h2>{{ headerTitle }}</h2>
        </div>
        <div class="header-right">
          <el-avatar size="small" :icon="UserFilled" />
          <span class="admin-name">{{ auth.admin?.username || '管理员' }}</span>
          <el-button type="primary" link @click="handleLogout">退出</el-button>
        </div>
      </el-header>
      <el-main class="layout__main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  background: #f5f7fa;
}

.layout__sider {
  background: #001529;
  color: #bfcbd9;
  display: flex;
  flex-direction: column;
}

.brand {
  height: 60px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.layout__header {
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-name {
  color: #333;
}

.layout__main {
  padding: 20px;
  background: #f5f7fa;
}
</style>

