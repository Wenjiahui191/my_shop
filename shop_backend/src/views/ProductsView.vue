<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { fetchProducts, createProduct, updateProduct, deleteProduct, updateProductStatus, fetchProductDetail } from '../api/products';
import { fetchCategoryTree } from '../api/categories';
import { uploadFile } from '../api/upload';

const state = reactive({
  list: [],
  loading: false,
  pagination: { page: 1, limit: 10, total: 0 },
  filters: { search: '', category_id: null },
});

const categories = ref([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const saving = ref(false);
const uploading = ref(false);
const filePath=import.meta.env.VITE_FILE_BASE || '';

const form = reactive({
  id: null,
  name: '',
  category_id: null,
  description: '',
  price: 0,
  stock: 0,
  image_url: '',
  status: 'on_shelf',
});

const categoryOptions = computed(() => {
  const flatten = (nodes, level = 0) =>
    nodes.flatMap((n) => [{ value: n.id, label: `${'— '.repeat(level)}${n.name}` }, ...flatten(n.children || [], level + 1)]);
  return flatten(categories.value || []);
});

const loadCategories = async () => {
  categories.value = (await fetchCategoryTree()).data;
};

const loadProducts = async () => {
  state.loading = true;
  try {
    const res = await fetchProducts({
      page: state.pagination.page,
      limit: state.pagination.limit,
      search: state.filters.search || undefined,
      category_id: state.filters.category_id || undefined,
    });
    state.list = res.data;
    state.pagination.total = res.pagination.total;
  } finally {
    state.loading = false;
  }
};

const handleSearch = () => {
  state.pagination.page = 1;
  loadProducts();
};

const handleSizeChange = (size) => {
  state.pagination.limit = size;
  state.pagination.page = 1;
  loadProducts();
};

const handlePageChange = (page) => {
  state.pagination.page = page;
  loadProducts();
};

const openCreate = () => {
  resetForm();
  isEdit.value = false;
  dialogVisible.value = true;
};

const openEdit = async (row) => {
  resetForm();
  try {
    const detail = await fetchProductDetail(row.id);
    Object.assign(form, detail);
    form.id = row.id;
    isEdit.value = true;
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error('获取商品详情失败');
  }
};

const resetForm = () => {
  form.id = null;
  form.name = '';
  form.category_id = null;
  form.description = '';
  form.price = 0;
  form.stock = 0;
  form.image_url = '';
  form.status = 'on_shelf';
};

const handleUploadImage = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('请上传图片文件（jpg, png, gif, webp）');
    event.target.value = '';
    return;
  }

  // 验证文件大小（最大 5MB）
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 5MB');
    event.target.value = '';
    return;
  }

  uploading.value = true;
  try {
    const result = (await uploadFile(file)).data;
    form.image_url = result.url;
    ElMessage.success('图片上传成功');
  } catch (error) {
    ElMessage.error('图片上传失败');
  } finally {
    uploading.value = false;
    event.target.value = '';
  }
};

const submit = async () => {
  if (!form.name || !form.price) {
    ElMessage.warning('请填写必填项');
    return;
  }
  saving.value = true;
  try {
    const payload = {
      category_id: form.category_id,
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      image_url: form.image_url,
      status: form.status,
    };
    if (isEdit.value && form.id) {
      await updateProduct(form.id, payload);
      ElMessage.success('商品已更新');
    } else {
      await createProduct(payload);
      ElMessage.success('商品已创建');
    }
    dialogVisible.value = false;
    loadProducts();
  } finally {
    saving.value = false;
  }
};

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除商品「${row.name}」？`, '提示', { type: 'warning' })
    .then(async () => {
      await deleteProduct(row.id);
      ElMessage.success('删除成功');
      loadProducts();
    })
    .catch(() => {});
};

const toggleStatus = async (row) => {
  const newStatus = row.status === 'on_shelf' ? 'off_shelf' : 'on_shelf';
  await updateProductStatus(row.id, newStatus);
  ElMessage.success('状态已更新');
  loadProducts();
};

onMounted(() => {
  loadCategories();
  loadProducts();
});
</script>

<template>
  <div class="page">
    <el-card shadow="hover">
      <div class="toolbar">
        <div class="filters">
          <el-input
            v-model="state.filters.search"
            placeholder="商品名称/描述"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleSearch"
          />
          <el-select v-model="state.filters.category_id" clearable placeholder="选择分类" style="width: 180px" @change="handleSearch">
            <el-option v-for="opt in categoryOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
        <el-button type="primary" @click="openCreate">新建商品</el-button>
      </div>

      <el-table v-loading="state.loading" :data="state.list" border stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" label="名称" min-width="160" />
        <el-table-column prop="price" label="价格" width="100" />
        <el-table-column prop="stock" label="库存" width="90" />
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'on_shelf'" type="success">上架</el-tag>
            <el-tag v-else type="info">下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
            <el-button type="warning" link size="small" @click="toggleStatus(row)">
              {{ row.status === 'on_shelf' ? '下架' : '上架' }}
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑商品' : '新建商品'" width="640px" destroy-on-close>
      <el-form label-width="90px">
        <el-form-item label="名称" required>
          <el-input v-model="form.name" placeholder="商品名称" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category_id" placeholder="选择分类" clearable>
            <el-option v-for="opt in categoryOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="商品描述" />
        </el-form-item>
        <el-form-item label="价格" required>
          <el-input-number v-model="form.price" :min="0" :step="0.01" controls-position="right" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="form.stock" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="商品图片">
          <div class="image-upload-container">
            <div v-if="form.image_url" class="image-preview">
              <img :src="filePath + form.image_url" :alt="form.name" />
              <el-button type="danger" size="small" @click="form.image_url = ''">删除</el-button>
            </div>
            <div v-else class="upload-button">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleUploadImage"
              />
              <el-button :loading="uploading" @click="$refs.fileInput?.click()">
                {{ uploading ? '上传中...' : '点击上传图片' }}
              </el-button>
              <p class="upload-tip">支持 jpg, png, gif, webp（最大 5MB）</p>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 160px">
            <el-option label="上架" value="on_shelf" />
            <el-option label="下架" value="off_shelf" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
}

.filters {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.image-upload-container {
  width: 100%;
}

.image-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.upload-button {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin: 0;
}
</style>

