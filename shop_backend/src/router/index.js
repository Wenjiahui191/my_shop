import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: { public: true },
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/',
      component: () => import('../layouts/AdminLayout.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          meta: { title: '仪表盘' },
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: 'users',
          name: 'users',
          meta: { title: '用户管理' },
          component: () => import('../views/UsersView.vue'),
        },
        {
          path: 'categories',
          name: 'categories',
          meta: { title: '分类管理' },
          component: () => import('../views/CategoriesView.vue'),
        },
        {
          path: 'products',
          name: 'products',
          meta: { title: '商品管理' },
          component: () => import('../views/ProductsView.vue'),
        },
        {
          path: 'orders',
          name: 'orders',
          meta: { title: '订单管理' },
          component: () => import('../views/OrdersView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  if (!to.meta.public && !auth.token) {
    next({ path: '/login', query: { redirect: to.fullPath } });
    return;
  }

  if (auth.token && !auth.profileLoaded && !to.meta.public) {
    try {
      await auth.fetchProfile();
    } catch (err) {
      auth.logout();
      next({ path: '/login' });
      return;
    }
  }

  if (to.path === '/login' && auth.token) {
    next('/');
    return;
  }

  next();
});

export default router;

