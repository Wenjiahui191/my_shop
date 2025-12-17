<script>
	export default {
		data() {
			return {
				isLogin: false
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			this.checkLoginStatus();
		},
		onShow: function() {
			console.log('App Show')
			this.checkLoginStatus();
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			checkLoginStatus() {
				const token = uni.getStorageSync('token');
				this.isLogin = !!token;
				this.updateTabBar();
			},
			updateTabBar() {
				// 根据登录状态动态更新 tabBar
				const list = [
					{
						pagePath: 'pages/index/index',
						text: '首页',
						iconPath: 'static/tabbar/home.png',
						selectedIconPath: 'static/tabbar/home-active.png'
					},
					{
						pagePath: 'pages/category/category',
						text: '分类',
						iconPath: 'static/tabbar/category.png',
						selectedIconPath: 'static/tabbar/category-active.png'
					}
				];

				// 只有登录后才显示购物车
				if (this.isLogin) {
					list.push({
						pagePath: 'pages/cart/cart',
						text: '购物车',
						iconPath: 'static/tabbar/cart.png',
						selectedIconPath: 'static/tabbar/cart-active.png'
					});
				}

				list.push({
					pagePath: 'pages/user/user',
					text: '我的',
					iconPath: 'static/tabbar/user.png',
					selectedIconPath: 'static/tabbar/user-active.png'
				});

				uni.setTabBarItem({
					index: list.length - 1,
					text: '我的',
					iconPath: 'static/tabbar/user.png',
					selectedIconPath: 'static/tabbar/user-active.png'
				});

				// 更新整个 tabBar
				uni.setTabBar({
					list: list
				});
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
