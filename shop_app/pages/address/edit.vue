<template>
  <view class="container">
    <view class="form-group">
      <label class="form-label">收货人姓名</label>
      <input v-model="form.name" class="form-input" placeholder="请输入收货人姓名" />
    </view>

    <view class="form-group">
      <label class="form-label">手机号码</label>
      <input v-model="form.phone" class="form-input" placeholder="请输入手机号码" type="tel" />
    </view>

    <view class="form-group">
      <label class="form-label">省份</label>
      <picker @change="handleProvinceChange" :value="form.province_index" :range="provinces">
        <view class="form-input picker-input">
          {{ form.province || '请选择省份' }}
        </view>
      </picker>
    </view>

    <view class="form-group">
      <label class="form-label">城市</label>
      <picker @change="handleCityChange" :value="form.city_index" :range="cities">
        <view class="form-input picker-input">
          {{ form.city || '请选择城市' }}
        </view>
      </picker>
    </view>

    <view class="form-group">
      <label class="form-label">区/县</label>
      <picker @change="handleDistrictChange" :value="form.district_index" :range="districts">
        <view class="form-input picker-input">
          {{ form.district || '请选择区/县' }}
        </view>
      </picker>
    </view>

    <view class="form-group">
      <label class="form-label">详细地址</label>
      <input v-model="form.detail" class="form-input" placeholder="请输入详细地址" />
    </view>

    <view class="form-group checkbox-group">
      <label class="checkbox-label">
        <checkbox :checked="form.is_default" @change="form.is_default = $event.detail.value" />
        <text>设为默认地址</text>
      </label>
    </view>

    <view class="form-actions">
      <button class="cancel-btn" @click="handleCancel">取消</button>
      <button class="submit-btn" @click="handleSubmit" :disabled="loading">
        {{ loading ? '提交中...' : '确定' }}
      </button>
    </view>
  </view>
</template>

<script>
import { addAddress, updateAddress, getAddresses } from '../../api/address';

// 简化的地址数据
const PROVINCES = ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区'];

const CITIES = {
  '北京市': ['东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云县', '延庆县'],
  '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明县'],
  '广东省': ['广州市', '深圳市', '珠海市', '汕头市', '佛山市', '韶关市', '河源市', '梅州市', '惠州市', '汕尾市', '东莞市', '中山市', '阳江市', '清远市', '潮州市', '揭阳市', '云浮市'],
  '其他': ['其他']
};

export default {
  data() {
    return {
      form: {
        id: null,
        name: '',
        phone: '',
        province: '',
        province_index: 0,
        city: '',
        city_index: 0,
        district: '',
        district_index: 0,
        detail: '',
        is_default: false
      },
      provinces: PROVINCES,
      cities: ['请选择'],
      districts: ['请选择'],
      loading: false,
      isEdit: false
    };
  },
  onLoad(options) {
    if (options.id) {
      this.form.id = options.id;
      this.isEdit = true;
      this.loadAddressDetail(options.id);
    }
  },
  methods: {
    async loadAddressDetail(id) {
      try {
        const addresses = await getAddresses();
        const address = addresses.find(a => a.id === parseInt(id));
        if (address) {
          this.form = {
            id: address.id,
            name: address.name,
            phone: address.phone,
            province: address.province,
            province_index: this.provinces.indexOf(address.province),
            city: address.city,
            city_index: 0,
            district: address.district,
            district_index: 0,
            detail: address.detail,
            is_default: address.is_default
          };
          this.handleProvinceChange({ detail: { value: this.form.province_index } });
        }
      } catch (error) {
        uni.showToast({
          title: '加载地址失败',
          icon: 'none'
        });
      }
    },
    handleProvinceChange(e) {
      const index = e.detail?.value || e;
      this.form.province = this.provinces[index];
      this.form.province_index = index;
      
      const provinceCities = CITIES[this.form.province] || ['其他'];
      this.cities = provinceCities;
      this.form.city = provinceCities[0];
      this.form.city_index = 0;
      this.form.district = '';
      this.form.district_index = 0;
      this.districts = ['请选择'];
    },
    handleCityChange(e) {
      const index = e.detail?.value || e;
      this.form.city = this.cities[index];
      this.form.city_index = index;
      this.form.district = '';
      this.form.district_index = 0;
      this.districts = ['请选择'];
    },
    handleDistrictChange(e) {
      const index = e.detail?.value || e;
      this.form.district = this.districts[index];
      this.form.district_index = index;
    },
    async handleSubmit() {
      if (!this.form.name) {
        uni.showToast({ title: '请输入收货人姓名', icon: 'none' });
        return;
      }
      if (!this.form.phone) {
        uni.showToast({ title: '请输入手机号码', icon: 'none' });
        return;
      }
      if (!this.form.province) {
        uni.showToast({ title: '请选择省份', icon: 'none' });
        return;
      }
      if (!this.form.city) {
        uni.showToast({ title: '请选择城市', icon: 'none' });
        return;
      }
      if (!this.form.detail) {
        uni.showToast({ title: '请输入详细地址', icon: 'none' });
        return;
      }

      this.loading = true;
      try {
        const data = {
          name: this.form.name,
          phone: this.form.phone,
          province: this.form.province,
          city: this.form.city,
          district: this.form.district || '其他',
          detail: this.form.detail,
          is_default: this.form.is_default
        };

        if (this.isEdit) {
          await updateAddress(this.form.id, data);
          uni.showToast({ title: '更新成功', icon: 'success' });
        } else {
          await addAddress(data);
          uni.showToast({ title: '添加成功', icon: 'success' });
        }

        setTimeout(() => {
          uni.navigateBack({ delta: 1 });
        }, 500);
      } catch (error) {
        uni.showToast({
          title: this.isEdit ? '更新失败' : '添加失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    handleCancel() {
      uni.navigateBack({ delta: 1 });
    }
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 15px;
}

.form-group {
  margin-bottom: 15px;
  background-color: #fff;
  padding: 15px;
  border-radius: 6px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.picker-input {
  background-color: #fff;
  color: #999;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
}

.checkbox-label checkbox {
  margin-right: 8px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.cancel-btn,
.submit-btn {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
}

.submit-btn {
  background-color: #3cc51f;
  color: #fff;
}

.submit-btn:disabled {
  background-color: #ccc;
}
</style>
