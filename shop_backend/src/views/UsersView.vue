<script setup>
import { reactive, ref, onMounted } from 'vue';
import { fetchUsers, fetchUserDetail } from '../api/users';

const state = reactive({
  list: [],
  loading: false,
  search: '',
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
});

const detail = ref(null);
const detailVisible = ref(false);

const loadUsers = async () => {
  state.loading = true;
  try {
    const res = await fetchUsers({
      page: state.pagination.page,
      limit: state.pagination.limit,
      search: state.search || undefined,
    });
    state.list = res.data;
    state.pagination.total = res.pagination.total;
  } finally {
    state.loading = false;
  }
};

const handleSearch = () => {
  state.pagination.page = 1;
  loadUsers();
};

const handleSizeChange = (size) => {
  state.pagination.limit = size;
  state.pagination.page = 1;
  loadUsers();
};

const handlePageChange = (page) => {
  state.pagination.page = page;
  loadUsers();
};

const openDetail = async (row) => {
  detailVisible.value = true;
  detail.value = null;
  const data = await fetchUserDetail(row.id);
  detail.value = data;
};

onMounted(loadUsers);
</script>

<template>
  <div class="page">
    <el-card shadow="hover">
      <div class="toolbar">
        <el-input
          v-model="state.search"
          placeholder="搜索用户名/手机号/昵称"
          clearable
          style="max-width: 280px"
          @keyup.enter.native="handleSearch"
        >
          <template #append>
            <el-button icon="Search" @click="handleSearch" />
          </template>
        </el-input>
      </div>

      <el-table v-loading="state.loading" :data="state.list" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="created_at" label="注册时间" width="180" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="openDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :page-sizes="[10, 20, 30, 50]"
          :total="state.pagination.total"
          :page-size="state.pagination.limit"
          :current-page="state.pagination.page"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <el-drawer v-model="detailVisible" size="420px" title="用户详情">
      <el-descriptions v-if="detail" :column="1" border>
        <el-descriptions-item label="ID">{{ detail.id }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ detail.username }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ detail.nickname }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ detail.phone }}</el-descriptions-item>
        <el-descriptions-item label="头像">
          <el-avatar v-if="detail.avatar_url" :src="detail.avatar_url" />
          <span v-else>—</span>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detail.created_at }}</el-descriptions-item>
      </el-descriptions>
      <el-empty v-else description="加载中..." />
    </el-drawer>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toolbar {
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
}

.pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>

