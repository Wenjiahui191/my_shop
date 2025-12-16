<template>
  <view class="page">
    <scroll-view class="content" scroll-y @scrolltolower="loadMore">
      <view v-if="list.length === 0 && !loading" class="empty">
        <text>还没有收藏任何商品</text>
      </view>

      <view v-for="item in list" :key="item.product_id" class="item" @tap="goDetail(item.product_id)">
        <image class="thumb" :src="item.image_url || defaultImg" mode="aspectFill" />
        <view class="info">
          <text class="name">{{ item.name }}</text>
          <text class="price">￥{{ item.price }}</text>
        </view>
        <button class="unfav-btn" @tap.stop="remove(item)">取消</button>
      </view>

      <view class="load-more">
        <text v-if="loading">加载中...</text>
        <text v-else-if="finished && list.length">已经到底了</text>
      </view>
    </scroll-view>
    <BottomTabbar />
  </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { listFavorites, removeFavorite } from '../../api/favorites';
import { useUserStore } from '../../store/user';
import BottomTabbar from '../../components/BottomTabbar.vue';

const userStore = useUserStore();

const list = ref([]);
const page = ref(1);
const pageSize = 10;
const loading = ref(false);
const finished = ref(false);
const defaultImg = '/static/logo.png';

async function ensureLogin() {
  if (!userStore.token.value) {
    uni.navigateTo({ url: '/pages/user/login' });
    return false;
  }
  return true;
}

async function fetchList(reset = false) {
  if (!userStore.token.value) return;
  if (loading.value || finished.value) return;
  loading.value = true;

  if (reset) {
    page.value = 1;
    finished.value = false;
  }

  try {
    const res = await listFavorites({
      page: page.value,
      limit: pageSize,
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
    // handled globally
  } finally {
    loading.value = false;
  }
}

function loadMore() {
  fetchList(false);
}

async function remove(item) {
  try {
    await removeFavorite(item.product_id);
    uni.showToast({ title: '已取消收藏', icon: 'none' });
    list.value = list.value.filter((i) => i.product_id !== item.product_id);
  } catch (e) {}
}

function goDetail(id) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` });
}

onShow(async () => {
  if (await ensureLogin()) {
    fetchList(true);
  }
});
</script>

<style scoped>
.page {
  height: 100vh;
  background-color: #f5f5f7;
  padding-bottom: 100rpx;
}

.content {
  height: 100%;
}

.item {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;
  margin: 16rpx 24rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
}

.thumb {
  width: 140rpx;
  height: 140rpx;
  border-radius: 16rpx;
  background-color: #f5f5f7;
}

.info {
  flex: 1;
  margin-left: 24rpx;
}

.name {
  font-size: 28rpx;
}

.price {
  margin-top: 8rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #ff6a00;
}

.unfav-btn {
  font-size: 24rpx;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background-color: #f5f5f7;
}

.load-more {
  padding: 24rpx 0 40rpx;
  text-align: center;
  color: #999;
  font-size: 26rpx;
}

.empty {
  padding-top: 120rpx;
  text-align: center;
  color: #999;
}
</style>


