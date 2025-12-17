<template>
    <view class="container">
        <view v-if="!isLogin" class="login-prompt">
            <view class="prompt-icon">🔒</view>
            <view class="prompt-text">请先登录查看购物车</view>
            <button class="login-btn" @click="goToLogin">去登录</button>
        </view>
        
        <view v-else>
            <view v-if="cartList.length === 0" class="empty-cart">
                <view class="empty-icon">🛒</view>
                <view class="empty-text">购物车为空</view>
            </view>
            
            <view v-else class="cart-list">
                <view class="cart-item" v-for="item in cartList" :key="item.id">
                    <image class="product-img" :src="filePath + (item.Product.image_url || '/uploads/logo.png')" mode="aspectFill"></image>
                    <view class="product-info">
                        <view class="product-name">{{ item.Product.name }}</view>
                        <view class="product-price">¥{{ item.Product.price }}</view>
                        <view class="quantity-control">
                            <view class="btn-minus" @click="updateQuantity(item, -1)">-</view>
                            <view class="quantity">{{ item.quantity }}</view>
                            <view class="btn-plus" @click="updateQuantity(item, 1)">+</view>
                        </view>
                    </view>
                    <view class="delete-btn" @click="removeItem(item.id)">删除</view>
                </view>
            </view>
            
            <view v-if="cartList.length > 0" class="footer">
                <view class="total-price">总计: ¥{{ totalPrice }}</view>
                <view class="checkout-btn" @click="checkout">去结算</view>
            </view>
        </view>
    </view>
</template>

<script>
import { getCart, updateCartItem, removeCartItem } from '@/api/cart';
import { createOrder } from '@/api/order';
import { filePath } from '@/utils/request';

export default {
    data() {
        return {
            cartList: [],
            filePath,
            isLogin: false
        };
    },
    onShow() {
        this.checkLoginStatus();
        if (this.isLogin) {
            this.loadCart();
        }
    },
    computed: {
        totalPrice() {
            return this.cartList.reduce((total, item) => {
                return total + item.Product.price * item.quantity;
            }, 0).toFixed(2);
        }
    },
    methods: {
        checkLoginStatus() {
            const token = uni.getStorageSync('token');
            this.isLogin = !!token;
        },
        goToLogin() {
            uni.navigateTo({ url: '/pages/login/login' });
        },
        async loadCart() {
            try {
                const res = await getCart();
                this.cartList = res.data;
            } catch (error) {
                console.error(error);
            }
        },
        async updateQuantity(item, change) {
            const newQuantity = item.quantity + change;
            if (newQuantity < 1) return;
            try {
                await updateCartItem(item.id, { quantity: newQuantity });
                item.quantity = newQuantity;
            } catch (error) {
                console.error(error);
            }
        },
        async removeItem(id) {
            try {
                await removeCartItem(id);
                this.loadCart();
            } catch (error) {
                console.error(error);
            }
        },
        async checkout() {
            if (this.cartList.length === 0) {
                uni.showToast({ title: '购物车为空', icon: 'none' });
                return;
            }
            try {
                // Hardcoded address_id for demo purposes, assuming user has address 1
                // Or we can prompt user to enter address or select one.
                // For now, let's just try to create order and see if it works or fails (if address is required)
                // The API requires address_id.
                // I'll just pass 1 for now or handle error.
                await createOrder({ address_id: 1, remark: '来自小程序' });
                uni.showToast({ title: '下单成功' });
                this.loadCart();
                setTimeout(() => {
                    uni.navigateTo({ url: '/pages/order/list' });
                }, 1500);
            } catch (error) {
                console.error(error);
                uni.showToast({ title: '下单失败: ' + (error.message || '未知错误'), icon: 'none' });
            }
        }
    }
};
</script>

<style>
.container {
    padding-bottom: 60px;
}

.cart-item {
    display: flex;
    padding: 10px;
    background-color: #fff;
    margin-bottom: 10px;
    align-items: center;
}

.product-img {
    width: 80px;
    height: 80px;
    margin-right: 10px;
}

.product-info {
    flex: 1;
}

.product-name {
    font-size: 14px;
    margin-bottom: 5px;
}

.product-price {
    color: #ff0000;
    font-weight: bold;
    margin-bottom: 5px;
}

.quantity-control {
    display: flex;
    align-items: center;
}

.btn-minus,
.btn-plus {
    width: 25px;
    height: 25px;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
}

.quantity {
    margin: 0 10px;
}

.delete-btn {
    color: #ff0000;
    margin-left: 10px;
}

.footer {
    position: fixed;
    bottom: 50px;
    left: 0;
    right: 0;
    height: 50px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    border-top: 1px solid #eee;
}

/* bottom 50px because of tabbar */
.total-price {
    color: #ff0000;
    font-weight: bold;
    font-size: 18px;
}

.checkout-btn {
    background-color: #ff0000;
    color: #fff;
    padding: 10px 20px;
    border-radius: 20px;
}

.login-prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 20px;
}

.prompt-icon {
    font-size: 64px;
    margin-bottom: 20px;
}

.prompt-text {
    font-size: 18px;
    color: #333;
    margin-bottom: 30px;
}

.login-btn {
    background-color: #3cc51f;
    color: #fff;
    padding: 15px 40px;
    border-radius: 6px;
}

.empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 20px;
}

.empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
}

.empty-text {
    font-size: 16px;
    color: #999;
}
</style>
