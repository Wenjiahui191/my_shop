<template>
  <view class="container" v-if="product">
    <image class="product-img" :src="filePath + (product.image_url || '/uploads/logo.png')" mode="aspectFill"></image>
    <view class="product-info">
      <view class="product-price">¥{{ product.price }}</view>
      <view class="product-name">{{ product.name }}</view>
      <view class="product-desc">{{ product.description }}</view>
      <view class="product-stock">库存: {{ product.stock }}</view>
    </view>
    <view class="footer">
      <view class="btn cart-btn" @click="addToCart">加入购物车</view>
      <view class="btn buy-btn" @click="buyNow">立即购买</view>
    </view>
  </view>
</template>

<script>
import { getProductById } from '@/api/product';
import { addToCart } from '@/api/cart';
import { filePath } from '@/utils/request';

export default {
  data() {
    return {
      product: null,
      filePath
    };
  },
  onLoad(options) {
    if (options.id) {
      this.loadProduct(options.id);
    }
  },
  methods: {
    async loadProduct(id) {
      try {
        const res = await getProductById(id);
        this.product = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    async addToCart() {
      try {
        await addToCart({ product_id: this.product.id, quantity: 1 });
        uni.showToast({ title: '已加入购物车' });
      } catch (error) {
        console.error(error);
      }
    },
    buyNow() {
      // Simplified: Add to cart then go to cart
      this.addToCart().then(() => {
        uni.switchTab({ url: '/pages/cart/cart' });
      });
    }
  }
};
</script>

<style>
.container { padding-bottom: 60px; }
.product-img { width: 100%; height: 300px; }
.product-info { padding: 15px; background-color: #fff; }
.product-price { color: #ff0000; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
.product-name { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
.product-desc { color: #666; font-size: 14px; margin-bottom: 10px; }
.product-stock { color: #999; font-size: 12px; }
.footer { position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 50px; background-color: #fff; border-top: 1px solid #eee; }
.btn { flex: 1; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; }
.cart-btn { background-color: #ff9900; }
.buy-btn { background-color: #ff0000; }
</style>
