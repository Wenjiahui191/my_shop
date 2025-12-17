<template>
  <view class="container">
    <!-- 地址列表 -->
    <view class="address-list">
      <view v-if="addresses.length === 0" class="empty-state">
        <text>暂无收货地址</text>
      </view>
      
      <view v-for="item in addresses" :key="item.id" class="address-item">
        <view class="address-header">
          <view class="address-name">{{ item.name }}</view>
          <view v-if="item.is_default" class="default-badge">默认</view>
        </view>
        <view class="address-detail">
          {{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}
        </view>
        <view class="address-phone">{{ item.phone }}</view>
        <view class="address-actions">
          <text class="action-btn edit-btn" @click="goToEdit(item.id)">编辑</text>
          <text class="action-btn delete-btn" @click="handleDelete(item.id)">删除</text>
          <text v-if="!item.is_default" class="action-btn set-default-btn" @click="setDefault(item.id)">设为默认</text>
        </view>
      </view>
    </view>

    <!-- 添加地址按钮 -->
    <view class="footer">
      <button class="add-address-btn" @click="goToAdd">+ 新增收货地址</button>
    </view>
  </view>
</template>

<script>
import { getAddresses, deleteAddress, updateAddress } from '../../api/address';

export default {
  data() {
    return {
      addresses: []
    };
  },
  onShow() {
    this.loadAddresses();
  },
  methods: {
    async loadAddresses() {
      try {
        const res = await getAddresses();
        this.addresses = res.data;
      } catch (error) {
        uni.showToast({
          title: '加载地址失败',
          icon: 'none'
        });
      }
    },
    goToAdd() {
      uni.navigateTo({ url: '/pages/address/edit' });
    },
    goToEdit(id) {
      uni.navigateTo({ url: `/pages/address/edit?id=${id}` });
    },
    async handleDelete(id) {
      uni.showModal({
        title: '提示',
        content: '确定要删除此地址吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await deleteAddress(id);
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              });
              this.loadAddresses();
            } catch (error) {
              uni.showToast({
                title: '删除失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    async setDefault(id) {
      try {
        const address = this.addresses.find(a => a.id === id);
        await updateAddress(id, {
          name: address.name,
          phone: address.phone,
          province: address.province,
          city: address.city,
          district: address.district,
          detail: address.detail,
          is_default: true
        });
        uni.showToast({
          title: '已设为默认地址',
          icon: 'success'
        });
        this.loadAddresses();
      } catch (error) {
        uni.showToast({
          title: '设置失败',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.address-list {
  flex: 1;
  padding: 10px 0;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
}

.address-item {
  margin: 10px 10px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.address-name {
  font-size: 16px;
  font-weight: bold;
  flex: 1;
}

.default-badge {
  background-color: #3cc51f;
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.address-detail {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.address-phone {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.address-actions {
  display: flex;
  gap: 10px;
  border-top: 1px solid #eee;
  padding-top: 12px;
}

.action-btn {
  flex: 1;
  text-align: center;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
}

.edit-btn {
  color: #3cc51f;
  border: 1px solid #3cc51f;
}

.delete-btn {
  color: #f56;
  border: 1px solid #f56;
}

.set-default-btn {
  color: #07c;
  border: 1px solid #07c;
}

.footer {
  padding: 15px 10px;
  background-color: #fff;
}

.add-address-btn {
  width: 100%;
  padding: 15px;
  background-color: #3cc51f;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
}
</style>
