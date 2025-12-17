# 商城用户小程序 (shop_app)

UniApp 开发的跨端商城小程序。

## 📋 项目结构

```
shop_app/
├── pages/              # 页面文件
│   ├── index/          # 首页
│   ├── category/       # 分类页
│   ├── product/        # 商品详情
│   ├── cart/           # 购物车
│   ├── order/          # 订单页
│   ├── address/        # 地址管理
│   ├── login/          # 登录
│   └── register/       # 注册
├── api/                # API 调用模块
├── static/             # 静态资源
├── utils/              # 工具函数
├── pages.json          # 页面配置
├── manifest.json       # 应用配置
└── main.js             # 应用入口
```

## 🚀 快速开始

### 1. 安装依赖
```bash
cd shop_app
npm install
```

### 2. 配置 API 地址
编辑 `utils/request.js`:
```javascript
const BASE_URL = 'http://localhost:3000';
```

### 3. 启动开发
```bash
npm run dev
```

### 4. 使用 HBuilderX 或其他 IDE 打开

## 📱 功能模块

### 首页 (pages/index/index.vue)
- 轮播图展示
- 分类快速导航
- 热门商品推荐
- 搜索功能

### 分类页 (pages/category/category.vue)
- 分类树展示
- 分类筛选
- 商品列表
- 排序功能

### 商品详情 (pages/product/detail.vue)
- 商品图片
- 商品信息
- 价格展示
- 添加购物车
- 收藏功能

### 购物车 (pages/cart/cart.vue)
- 购物车列表
- 数量修改
- 移除商品
- 结算
- 未登录状态提示

### 订单管理 (pages/order/list.vue)
- 订单列表
- 订单详情
- 订单状态
- 订单取消

### 地址管理 (pages/address/list.vue & edit.vue)
- 地址列表
- 添加地址
- 编辑地址
- 删除地址
- 设置默认地址

### 登录注册 (pages/login/login.vue & register/register.vue)
- 用户注册
- 用户登录
- 表单验证

## 🔗 API 模块

### api/auth.js - 认证 API
```javascript
export const register(data)      // 注册
export const login(data)         // 登录
export const getProfile()        // 获取个人信息
```

### api/product.js - 商品 API
```javascript
export const getCategories()     // 获取分类
export const getProducts(params) // 获取商品列表
export const getProductDetail(id) // 获取商品详情
```

### api/cart.js - 购物车 API
```javascript
export const addToCart(data)     // 添加到购物车
export const getCart()           // 获取购物车
export const updateCartItem(id, data) // 修改购物车
export const removeCartItem(id)  // 删除购物车项
```

### api/order.js - 订单 API
```javascript
export const createOrder(data)   // 创建订单
export const getOrders(params)   // 获取订单列表
export const getOrderDetail(id)  // 获取订单详情
export const cancelOrder(id)     // 取消订单
```

### api/address.js - 地址 API
```javascript
export const getAddresses()      // 获取地址列表
export const addAddress(data)    // 添加地址
export const updateAddress(id, data) // 更新地址
export const deleteAddress(id)   // 删除地址
```

### api/upload.js - 上传 API
```javascript
export const uploadFile(file)    // 上传文件
export const uploadProductImage(file) // 上传商品图片
export const deleteFile(filename) // 删除文件
```

## 🛠️ 工具函数

### utils/request.js - HTTP 请求工具
- 自动注入 Authorization header
- 统一错误处理
- 自动 token 刷新（当需要时）

## 📊 状态管理

- 使用 `uni.setStorageSync/getStorageSync` 进行本地存储
- Token 存储: `uni.getStorageSync('token')`
- 用户信息存储: `uni.getStorageSync('user')`

## 🔐 登录流程

1. 用户输入用户名密码
2. 调用 `login()` API
3. 获得 token 和 user 信息
4. 保存到本地存储
5. 更新 App.vue 中的 tabBar
6. 跳转到首页

## 🎨 样式系统

- 使用 `uni.scss` 全局样式
- 支持响应式设计
- 分辨率自适应

## 📦 页面配置 (pages.json)

```json
{
  "pages": [
    {"path": "pages/index/index", "style": {"navigationBarTitleText": "首页"}},
    ...
  ],
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#3cc51f",
    "list": [...]
  }
}
```

## ✅ 登录状态下的功能

- 购物车 tab 显示
- 订单管理
- 地址管理
- 收藏商品

## ❌ 未登录状态下的功能

- 首页浏览（只显示已上架商品）
- 分类浏览
- 商品详情查看
- 购物车 tab 隐藏，点击提示登录

## 🚨 常见问题

### 页面找不到
- 检查 pages.json 是否正确注册页面
- 检查路径是否正确

### 请求失败
- 检查后端服务是否运行
- 检查 API_BASE_URL 配置
- 查看浏览器控制台错误信息

### 图片加载失败
- 确保图片 URL 正确
- 检查后端文件服务是否启用

## 🔄 生命周期

### 页面生命周期
```javascript
onLoad()    // 页面加载时
onShow()    // 页面显示时（每次进入）
onHide()    // 页面隐藏时
onUnload()  // 页面卸载时
```

### 应用生命周期 (App.vue)
```javascript
onLaunch()  // 应用启动
onShow()    // 应用显示
onHide()    // 应用隐藏
```

## 📞 开发建议

1. 使用 HBuilderX 提供的 uni-app 调试工具
2. 在模拟器上测试各种屏幕尺寸
3. 定期测试网络异常场景
4. 使用 console.log 进行调试

---

**最后更新**: 2025年12月17日
