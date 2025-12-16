<template>
  <view class="page">
    <image class="banner" :src="detail.image_url || defaultImg" mode="aspectFill" />

    <view class="body">
      <view class="title-row">
        <text class="name">{{ detail.name }}</text>
        <button class="fav-btn" :class="{ active: liked }" @tap="toggleFavorite">
          {{ liked ? '已收藏' : '收藏' }}
        </button>
      </view>
      <text class="price">￥{{ detail.price }}</text>
      <text class="desc" v-if="detail.description">{{ detail.description }}</text>
    </view>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { fetchProductDetail } from '../../api/products';
import { addFavorite, removeFavorite, checkFavorite } from '../../api/favorites';
import { useUserStore } from '../../store/user';

const detail = ref({});
const defaultImg = '/static/logo.png';
const liked = ref(false);
const productId = ref(null);

const userStore = useUserStore();

async function loadDetail(id) {
  const data = await fetchProductDetail(id);
  detail.value = data;
}

async function loadFavoriteStatus(id) {
  try {
    const res = await checkFavorite(id);
    liked.value = !!res?.liked;
  } catch (e) {
    liked.value = false;
  }
}

async function ensureLogin() {
  if (!userStore.token.value) {
    uni.navigateTo({ url: '/pages/user/login' });
    return false;
  }
  return true;
}

async function toggleFavorite() {
  if (!(await ensureLogin()) || !productId.value) return;

  try {
    if (liked.value) {
      await removeFavorite(productId.value);
      liked.value = false;
      uni.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      await addFavorite(productId.value);
      liked.value = true;
      uni.showToast({ title: '收藏成功', icon: 'none' });
    }
  } catch (e) {
    // 错误已在 request 处理
  }
}

onLoad((options) => {
  const id = Number(options?.id);
  if (!id) return;
  productId.value = id;
  loadDetail(id);
  loadFavoriteStatus(id);
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f7;
}

.banner {
  width: 100%;
  height: 420rpx;
  background-color: #f5f5f7;
}

.body {
  margin-top: -32rpx;
  padding: 32rpx 28rpx 40rpx;
  border-radius: 32rpx 32rpx 0 0;
  background-color: #ffffff;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.name {
  font-size: 32rpx;
  font-weight: 600;
}

.fav-btn {
  padding: 10rpx 24rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  background-color: #f5f5f7;
  color: #333333;
}

.fav-btn.active {
  background-color: #000000;
  color: #ffffff;
}

.price {
  margin-top: 16rpx;
  font-size: 36rpx;
  font-weight: 700;
  color: #ff6a00;
}

.desc {
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #777777;
  line-height: 1.6;
}
</style>


