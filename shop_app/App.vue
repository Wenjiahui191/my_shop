<script>
export default {
	data() {
		return {
			isLogin: false
		}
	},
	onLaunch: function () {
		console.log('App Launch')
		this.checkLoginStatus();
	},
	onShow: function () {
		console.log('App Show')
		this.checkLoginStatus();
	},
	onHide: function () {
		console.log('App Hide')
	},
	methods: {
		checkLoginStatus() {
			const token = uni.getStorageSync('token');
			this.isLogin = !!token;
			this.updateTabBar();
		},
		updateTabBar() {
		}
	}
}
</script>

<style>
/*每个页面公共css */
</style>
