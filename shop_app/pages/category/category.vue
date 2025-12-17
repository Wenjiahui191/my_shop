<template>
  <view class="container">
    <view class="category-list">
      <view 
        class="category-item" 
        :class="{ active: currentId === item.id }" 
        v-for="item in categories" 
        :key="item.id"
        @click="selectCategory(item.id)"
      >
        {{ item.name }}
      </view>
    </view>
    <view class="product-list">
      <view class="product-item" v-for="item in products" :key="item.id" @click="goToDetail(item.id)">
        <image class="product-img" :src="filePath + (item.image_url || '/uploads/logo.png')" mode="aspectFill"></image>
        <view class="product-info">
          <view class="product-name">{{ item.name }}</view>
          <view class="product-price">¥{{ item.price }}</view>
        </view>
      </view>
      <view v-if="products.length === 0" class="empty">暂无商品</view>
    </view>
  </view>
</template>

<script>
import { getCategories, getProducts } from '@/api/product';
import { filePath } from '@/utils/request';

export default {
  data() {
    return {
      categories: [],
      currentId: null,
      products: [],
      filePath
    };
  },
  onLoad() {
    this.loadCategories();
  },
  methods: {
    async loadCategories() {
      try {
        const res = await getCategories();
        this.categories = res.data;
        if (this.categories.length > 0) {
          this.selectCategory(this.categories[0].id);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async selectCategory(id) {
      this.currentId = id;
      try {
        const res = await getProducts({ category_id: id, page: 1, limit: 100 });
        this.products = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    goToDetail(id) {
      uni.navigateTo({ url: `/pages/product/detail?id=${id}` });
    }
  }
};
</script>

<style>
.container { display: flex; height: 100vh; }
.category-list { width: 100px; background-color: #f8f8f8; height: 100%; overflow-y: auto; }
.category-item { padding: 15px 10px; text-align: center; font-size: 14px; border-bottom: 1px solid #eee; }
.category-item.active { background-color: #fff; color: #3cc51f; border-left: 3px solid #3cc51f; }
.product-list { flex: 1; padding: 10px; overflow-y: auto; }
.product-item { display: flex; margin-bottom: 10px; background-color: #fff; padding: 10px; border-radius: 5px; }
.product-img { width: 80px; height: 80px; margin-right: 10px; border-radius: 5px; }
.product-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.product-name { font-size: 14px; }
.product-price { color: #ff0000; font-weight: bold; }
.empty { text-align: center; margin-top: 50px; color: #999; }
</style>
