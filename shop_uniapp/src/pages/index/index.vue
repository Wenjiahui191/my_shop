<template>
  <view class="page">
    <view class="search-bar">
      <input
        v-model="keyword"
        class="search-input"
        type="text"
        placeholder="搜索商品"
        confirm-type="search"
        @confirm="handleSearch"
      />
    </view>

    <scroll-view class="content" scroll-y @scrolltolower="loadMore">
      <view class="section-title">热门商品</view>

      <view class="product-grid">
        <view
          v-for="item in list"
          :key="item.id"
          class="product-card"
          @tap="goDetail(item.id)"
        >
          <image class="product-image" :src="item.image_url || defaultImg" mode="aspectFill" />
          <view class="product-info">
            <text class="name">{{ item.name }}</text>
            <text class="price">￥{{ item.price }}</text>
          </view>
        </view>
      </view>

      <view class="load-more">
        <text v-if="loading">加载中...</text>
        <text v-else-if="finished">已经到底了</text>
      </view>
    </scroll-view>
    <BottomTabbar />
  </view>
</template>

<script setup>
import { onLoad, onReachBottom } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { fetchProducts } from '../../api/products';
import BottomTabbar from '../../components/BottomTabbar.vue';

const list = ref([]);
const page = ref(1);
const pageSize = 10;
const loading = ref(false);
const finished = ref(false);
const keyword = ref('');
const defaultImg = '/static/logo.png';

async function fetchList(reset = false) {
  if (loading.value || finished.value) return;
  loading.value = true;

  if (reset) {
    page.value = 1;
    finished.value = false;
  }

  try {
    const res = await fetchProducts({
      page: page.value,
      limit: pageSize,
      search: keyword.value,
    });

    const data = res?.data || [];
    if (reset) {
      list.value = data;
    } else {
      list.value = list.value.concat(data);
    }

    if (!data.length || data.length < pageSize) {
      finished.value = true;
    } else {
      page.value += 1;
    }
  } catch (e) {
    // 错误已在 request 层提示
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  fetchList(true);
}

function loadMore() {
  fetchList(false);
}

function goDetail(id) {
  uni.navigateTo({
    url: `/pages/product/detail?id=${id}`,
  });
}

onLoad(() => {
  fetchList(true);
});

onReachBottom(() => {
  loadMore();
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-bottom: 100rpx;
}

.search-bar {
  padding: 16rpx 24rpx;
  background-color: #ffffff;
}

.search-input {
  background-color: #f2f2f5;
  border-radius: 999rpx;
  padding: 16rpx 24rpx;
  font-size: 28rpx;
}

.content {
  flex: 1;
  padding: 0 24rpx 24rpx;
}

.section-title {
  margin: 24rpx 0 16rpx;
  font-size: 32rpx;
  font-weight: 600;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.product-card {
  width: 48%;
  margin-bottom: 24rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
}

.product-image {
  width: 100%;
  height: 260rpx;
  background-color: #f5f5f7;
}

.product-info {
  padding: 16rpx 20rpx 20rpx;
}

.name {
  font-size: 28rpx;
  color: #333333;
}

.price {
  margin-top: 8rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #ff6a00;
}

.load-more {
  padding: 24rpx 0;
  text-align: center;
  color: #999999;
  font-size: 26rpx;
}
</style>
