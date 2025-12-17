<template>
  <view class="container">
    <view class="search-bar">
      <input class="search-input" v-model="keyword" placeholder="搜索商品" @confirm="onSearch" />
    </view>
    <view class="product-list">
      <view class="product-item" v-for="item in products" :key="item.id" @click="goToDetail(item.id)">
        <image class="product-img" :src="filePath + (item.image_url || '/uploads/logo.png')" mode="aspectFill"></image>
        <view class="product-info">
          <view class="product-name">{{ item.name }}</view>
          <view class="product-price">¥{{ item.price }}</view>
        </view>
      </view>
    </view>
    <view class="loading" v-if="loading">加载中...</view>
    <view class="no-more" v-if="!hasMore">没有更多了</view>
  </view>
</template>

<script>
import { getProducts } from '@/api/product';
import { filePath } from '@/utils/request';

export default {
  data() {
    return {
      products: [],
      page: 1,
      limit: 10,
      keyword: '',
      loading: false,
      hasMore: true,
	  filePath
    };
  },
  onShow() {
    this.loadProducts();
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.page++;
      this.loadProducts();
    }
  },
  methods: {
    async loadProducts() {
      this.loading = true;
      try {
        const res = await getProducts({
          page: this.page,
          limit: this.limit,
          search: this.keyword
        });
        if (this.page === 1) {
          this.products = res.data;
        } else {
          this.products = [...this.products, ...res.data];
        }
        this.hasMore = this.products.length < res.pagination.total;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    onSearch() {
      this.page = 1;
      this.hasMore = true;
      this.loadProducts();
    },
    goToDetail(id) {
      uni.navigateTo({ url: `/pages/product/detail?id=${id}` });
    }
  }
};
</script>

<style>
.container { padding: 10px; background-color: #f8f8f8; min-height: 100vh; }
.search-bar { padding: 10px; background-color: #fff; margin-bottom: 10px; border-radius: 5px; }
.search-input { width: 100%; }
.product-list { display: flex; flex-wrap: wrap; justify-content: space-between; }
.product-item { width: 48%; background-color: #fff; margin-bottom: 10px; border-radius: 5px; overflow: hidden; }
.product-img { width: 100%; height: 150px; }
.product-info { padding: 10px; }
.product-name { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 5px; }
.product-price { color: #ff0000; font-weight: bold; }
.loading, .no-more { text-align: center; padding: 10px; color: #999; }
</style>	