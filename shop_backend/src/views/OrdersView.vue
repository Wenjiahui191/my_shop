<script setup>
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { fetchOrders, fetchOrderDetail, shipOrder } from '../api/orders';

const statusOptions = [
  { label: '待支付', value: 'pending' },
  { label: '已支付', value: 'paid' },
  { label: '已发货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
];

const state = reactive({
  list: [],
  loading: false,
  pagination: { page: 1, limit: 10, total: 0 },
  filters: { status: '', order_no: '' },
});

const detailVisible = ref(false);
const detail = ref(null);
const shippingForm = reactive({
  tracking_number: '',
  tracking_company: '',
});
const shippingLoading = ref(false);

const loadOrders = async () => {
  state.loading = true;
  try {
    const res = await fetchOrders({
      page: state.pagination.page,
      limit: state.pagination.limit,
      status: state.filters.status || undefined,
      order_no: state.filters.order_no || undefined,
    });
    state.list = res.data;
    state.pagination.total = res.pagination.total;
  } finally {
    state.loading = false;
  }
};

const handleSearch = () => {
  state.pagination.page = 1;
  loadOrders();
};

const handleSizeChange = (size) => {
  state.pagination.limit = size;
  state.pagination.page = 1;
  loadOrders();
};

const handlePageChange = (page) => {
  state.pagination.page = page;
  loadOrders();
};

const openDetail = async (row) => {
  detailVisible.value = true;
  detail.value = null;
  shippingForm.tracking_company = '';
  shippingForm.tracking_number = '';
  const data = await fetchOrderDetail(row.id);
  try {
    data.address_snapshot = data.address_snapshot ? JSON.parse(data.address_snapshot) : null;
  } catch (e) {
    data.address_snapshot = null;
  }
  detail.value = data;
};

const handleShip = () => {
  if (!detail.value) return;
  if (detail.value.status !== 'paid') {
    ElMessage.warning('仅已支付订单可发货');
    return;
  }
  if (!shippingForm.tracking_company || !shippingForm.tracking_number) {
    ElMessage.warning('请填写物流信息');
    return;
  }
  ElMessageBox.confirm('确认发货？', '提示', { type: 'warning' })
    .then(async () => {
      shippingLoading.value = true;
      await shipOrder(detail.value.id, {
        tracking_company: shippingForm.tracking_company,
        tracking_number: shippingForm.tracking_number,
      });
      ElMessage.success('发货成功');
      detailVisible.value = false;
      shippingLoading.value = false;
      loadOrders();
    })
    .catch(() => {});
};

onMounted(loadOrders);
</script>

<template>
  <div class="page">
    <el-card shadow="hover">
      <div class="toolbar">
        <div class="filters">
          <el-select v-model="state.filters.status" placeholder="订单状态" clearable style="width: 160px" @change="handleSearch">
            <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
          <el-input
            v-model="state.filters.order_no"
            placeholder="订单号"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleSearch"
          />
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
      </div>

      <el-table v-loading="state.loading" :data="state.list" border stripe>
        <el-table-column prop="order_no" label="订单号" width="160" />
        <el-table-column prop="username" label="用户" width="140" />
        <el-table-column prop="total_amount" label="金额" width="100" />
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === 'paid' ? 'warning' : row.status === 'shipped' ? 'info' : row.status === 'completed' ? 'success' : row.status === 'cancelled' ? 'danger' : 'default'">
              {{ statusOptions.find((i) => i.value === row.status)?.label || row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openDetail(row)">详情</el-button>
            <el-button v-if="row.status === 'paid'" type="success" link size="small" @click="openDetail(row)">
              发货
            </el-button>
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

    <el-drawer v-model="detailVisible" size="520px" title="订单详情">
      <template #default>
        <el-skeleton v-if="!detail" rows="6" animated />
        <div v-else class="detail">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="订单号">{{ detail.order_no }}</el-descriptions-item>
            <el-descriptions-item label="用户">{{ detail.username || detail.nickname }}</el-descriptions-item>
            <el-descriptions-item label="金额">¥ {{ detail.total_amount }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              {{ statusOptions.find((i) => i.value === detail.status)?.label || detail.status }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ detail.created_at }}</el-descriptions-item>
            <el-descriptions-item v-if="detail.address_snapshot" label="收货信息">
              <div>
                <div>{{ detail.address_snapshot.name }} {{ detail.address_snapshot.phone }}</div>
                <div>
                  {{
                    `${detail.address_snapshot.province || ''}${detail.address_snapshot.city || ''}${detail.address_snapshot.district || ''}${detail.address_snapshot.detail || ''}`
                  }}
                </div>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="物流信息">
              <div v-if="detail.tracking_number">
                <div>{{ detail.tracking_company }}</div>
                <div>{{ detail.tracking_number }}</div>
              </div>
              <span v-else>未填写</span>
            </el-descriptions-item>
          </el-descriptions>

          <h4>商品明细</h4>
          <el-table :data="detail.items || []" size="small" border>
            <el-table-column prop="product_name" label="商品" />
            <el-table-column prop="price" label="单价" width="100" />
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column label="小计" width="100">
              <template #default="{ row }">¥ {{ (row.price * row.quantity).toFixed(2) }}</template>
            </el-table-column>
          </el-table>

          <div v-if="detail.status === 'paid'" class="ship-form">
            <el-input v-model="shippingForm.tracking_company" placeholder="物流公司" />
            <el-input v-model="shippingForm.tracking_number" placeholder="物流单号" />
            <el-button type="primary" :loading="shippingLoading" @click="handleShip">确认发货</el-button>
          </div>
        </div>
      </template>
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

.filters {
  display: flex;
  gap: 8px;
  align-items: center;
}

.pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ship-form {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  align-items: center;
}
</style>

