<template>
  <view class="container">
    <view class="order-list">
      <view class="order-item" v-for="order in orders" :key="order.id">
        <view class="order-header">
          <text>订单号: {{ order.order_no }}</text>
          <text class="status">{{ orderStatusMap[order.status] }}</text>
        </view>
        <view class="order-products">
          <view class="product-item" v-for="item in order.OrderItems" :key="item.id">
             <image class="product-img" :src="item.Product.image || '/static/logo.png'" mode="aspectFill"></image>
             <view class="product-info">
               <view class="product-name">{{ item.Product.name }}</view>
               <view class="product-price">¥{{ item.price }} x {{ item.quantity }}</view>
             </view>
          </view>
        </view>
        <view class="order-footer">
          <text>总价: ¥{{ order.total_amount }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getOrders } from '@/api/order';

export default {
  data() {
    return {
      orders: [],
      orderStatusMap: {
        pending: '待付款',
        paid: '已付款',
        shipped: '已发货',
        completed: '已完成',
        cancelled: '已取消'
      }
    };
  },
  onShow() {
    this.loadOrders();
  },
  methods: {
    async loadOrders() {
      try {
        const res = await getOrders();
        this.orders = res.data;
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style>
.container { padding: 10px; background-color: #f8f8f8; min-height: 100vh; }
.order-item { background-color: #fff; margin-bottom: 10px; padding: 10px; border-radius: 5px; }
.order-header { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px; font-size: 14px; color: #666; }
.status { color: #ff9900; }
.product-item { display: flex; margin-bottom: 10px; }
.product-img { width: 60px; height: 60px; margin-right: 10px; }
.product-info { flex: 1; }
.product-name { font-size: 14px; margin-bottom: 5px; }
.product-price { color: #999; font-size: 12px; }
.order-footer { text-align: right; font-weight: bold; border-top: 1px solid #eee; padding-top: 10px; }
</style>
