<script setup>
import { onLaunch } from '@dcloudio/uni-app';
import { useUserStore } from './store/user';

const userStore = useUserStore();

onLaunch(() => {
  userStore.initFromStorage();
});
</script>

<style>
/* 全局样式可写在此处或 uni.scss */
page {
  background-color: #f5f5f7;
}
</style>
