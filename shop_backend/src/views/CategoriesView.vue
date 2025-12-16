<script setup>
import { onMounted, reactive, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { fetchCategoryTree, createCategory, updateCategory, deleteCategory } from '../api/categories';

const treeData = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);

const form = reactive({
  id: null,
  name: '',
  parent_id: null,
  image_url: '',
  sort_order: 0,
});

const resetForm = () => {
  form.id = null;
  form.name = '';
  form.parent_id = null;
  form.image_url = '';
  form.sort_order = 0;
};

const loadTree = async () => {
  loading.value = true;
  try {
    treeData.value = await fetchCategoryTree();
  } finally {
    loading.value = false;
  }
};

const openCreate = (parentId = null) => {
  resetForm();
  form.parent_id = parentId;
  isEdit.value = false;
  dialogVisible.value = true;
};

const openEdit = (node) => {
  resetForm();
  form.id = node.id;
  form.name = node.name;
  form.parent_id = node.parent_id;
  form.image_url = node.image_url;
  form.sort_order = node.sort_order;
  isEdit.value = true;
  dialogVisible.value = true;
};

const submit = async () => {
  if (!form.name) {
    ElMessage.warning('请输入分类名称');
    return;
  }
  if (isEdit.value) {
    await updateCategory(form.id, {
      name: form.name,
      parent_id: form.parent_id,
      image_url: form.image_url,
      sort_order: form.sort_order,
    });
    ElMessage.success('分类已更新');
  } else {
    await createCategory({
      name: form.name,
      parent_id: form.parent_id,
      image_url: form.image_url,
      sort_order: form.sort_order,
    });
    ElMessage.success('分类已创建');
  }
  dialogVisible.value = false;
  loadTree();
};

const handleDelete = (node) => {
  ElMessageBox.confirm(`确认删除分类「${node.name}」？`, '提示', { type: 'warning' })
    .then(async () => {
      await deleteCategory(node.id);
      ElMessage.success('删除成功');
      loadTree();
    })
    .catch(() => {});
};

onMounted(loadTree);
</script>

<template>
  <div class="page">
    <div class="toolbar">
      <el-button type="primary" @click="openCreate()">新建分类</el-button>
    </div>

    <el-card shadow="hover">
      <el-tree
        v-loading="loading"
        :data="treeData"
        node-key="id"
        default-expand-all
        :props="{ label: 'name', children: 'children' }"
      >
        <template #default="{ data }">
          <div class="tree-node">
            <span>{{ data.name }}</span>
            <div class="tree-actions">
              <el-button size="small" type="primary" text @click.stop="openCreate(data.id)">新增</el-button>
              <el-button size="small" text @click.stop="openEdit(data)">编辑</el-button>
              <el-button size="small" type="danger" text @click.stop="handleDelete(data)">删除</el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑分类' : '新建分类'" width="480px">
      <el-form label-width="90px">
        <el-form-item label="名称" required>
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="父级分类">
          <el-tree-select
            v-model="form.parent_id"
            :data="treeData"
            check-strictly
            clearable
            placeholder="默认顶级分类"
            :props="{ value: 'id', label: 'name', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="图片URL">
          <el-input v-model="form.image_url" placeholder="可选" />
        </el-form-item>
        <el-form-item label="排序权重">
          <el-input-number v-model="form.sort_order" :min="0" :max="999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
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
  justify-content: flex-end;
}

.tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.tree-actions {
  display: flex;
  gap: 6px;
}
</style>

